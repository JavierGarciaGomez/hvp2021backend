---
title: "SP2: New Resources - CFDI Entities and Extensions"
issue: "https://github.com/JavierGarciaGomez/hvp2021backend/issues/9"
created: "2026-01-02"
status: "active"
type: "subplan"
parent: "20260102-GH9-cfdi-facturama-integration.md"
assignee: "Backend Team"
priority: "high"
estimated_hours: 24
tags: ["cfdi", "entities", "ddd", "company-settings", "collaborator", "sat-catalogs"]
---

# SP2: Phase 2 - New Resources Implementation Plan

> **GitHub Issue:** [GH9 - Implement Facturama API integration for CFDI Nómina](https://github.com/JavierGarciaGomez/hvp2021backend/issues/9)
> **Master Plan:** [20260102-GH9-cfdi-facturama-integration.md](./20260102-GH9-cfdi-facturama-integration.md)
> **Created:** 2026-01-02
> **Status:** Active
> **Type:** Subplan

---

## Master Plan Reference

🔗 **Parent Plan:** [20260102-GH9-cfdi-facturama-integration.md](./20260102-GH9-cfdi-facturama-integration.md)
🔗 **GitHub Issue:** [GH9 - Implement Facturama API integration for CFDI Nómina](https://github.com/JavierGarciaGomez/hvp2021backend/issues/9)

**Integration Point:** This subplan implements Phase 2 of the master plan.

**Dependencies:**
- **Blocks:** Phase 3 (New Payroll Schema) cannot proceed until this is complete
- **Blocked by:** Phase 1 (Analysis & Design) - Completed ✅
- **Related:** None

---

## 📋 Overview

Phase 2 focuses on creating and extending resources needed for CFDI compliance:
- Create new CompanySettings aggregate (singleton)
- Extend Collaborator with fiscal/CFDI fields
- Extend Employment with contract/workday type fields
- Implement SAT catalog validation

**Prerequisite:** Phase 1 (Analysis & Design) complete ✅

---

## 🎯 Phase 2 Goals

- [x] CompanySettings aggregate functional ✅
- [x] Address Value Object unified (international + Mexican formats) ✅
- [x] Collaborator entity extended with CFDI fields ✅
- [x] Employment entity extended with SAT catalog fields ✅
- [x] SAT catalogs implemented and validated ✅
- [x] Migration scripts for existing data ✅

---

## 📦 2.1 CompanySettings Aggregate (Singleton)

**Status:** ✅ **COMPLETED**
**Completion Date:** 20260102

### Implementation Checklist

- [x] **Domain Layer**
  - [x] Create `CompanySettingsEntity` with fiscal fields
  - [x] Create `CompanySettingsRepository` interface
  - [x] Create `CompanySettingsDatasource` interface
  - [x] Validation logic in entity

- [x] **Infrastructure Layer**
  - [x] Create `CompanySettingsModel` (MongoDB)
  - [x] Implement singleton constraint (pre-save hook)
  - [x] Create `CompanySettingsDatasourceMongoImp`
  - [x] Create `CompanySettingsRepositoryImpl`

- [x] **Application Layer**
  - [x] Create `CompanySettingsService` with cache
  - [x] Create `CompanySettingsDTO`
  - [x] Implement `getOrFail()` method

- [x] **Presentation Layer**
  - [x] Create `CompanySettingsController` (CRUD)
  - [x] Create `CompanySettingsRoutes`
  - [x] Register routes in `appRoutes.ts`

- [x] **Additional Tasks**
  - [x] Create seed script (`seed-company-settings.ts`)
  - [x] Create unified `Address` Value Object
  - [x] Merge international + Mexican address formats
  - [x] Update exports in index files

### Files Created/Modified

**Created:**
- `src/domain/entities/company-settings.entity.ts`
- `src/domain/repositories/company-settings.repository.ts`
- `src/domain/datasources/company-settings.datasource.ts`
- `src/infrastructure/db/mongo/models/company-settings.model.ts`
- `src/infrastructure/datasources/company-settings.datasource.mongo-imp.ts`
- `src/infrastructure/repositories/company-settings.repository.imp.ts`
- `src/application/services/company-settings.service.ts`
- `src/application/dtos/company-settings.dto.ts`
- `src/presentation/controllers/company-settings.controller.ts`
- `src/presentation/routes/company-settings.routes.ts`
- `src/scripts/seed-company-settings.ts`
- `.claude/plans/how-to-test-company-settings.md`

**Modified:**
- `src/domain/value-objects/address.vo.ts` (unified Address VO)
- `src/domain/entities/index.ts`
- `src/domain/repositories/index.ts`
- `src/domain/datasources/index.ts`
- `src/infrastructure/db/mongo/models/index.ts`
- `src/presentation/routes/index.ts`
- `src/presentation/appRoutes.ts`
- `src/mainRoutes.ts`

### Key Implementation Details

**Singleton Pattern:**
```typescript
// Pre-save hook ensures only one document exists
CompanySettingsSchema.pre("save", async function (next) {
  const count = await mongoose.model("CompanySettings").countDocuments();
  if (count > 0 && this.isNew) {
    throw new Error("Only one document allowed (singleton)");
  }
  next();
});
```

**In-Memory Cache:**
```typescript
// Service layer caches singleton for performance
private cache: CompanySettingsEntity | null = null;
private cacheInitialized: boolean = false;
```

**Unified Address VO:**
- Supports both international (line1/line2) and Mexican (street, exteriorNumber, neighborhood) formats
- Common fields: city, state, country, zipCode
- Methods: `isMexicanFormat()`, `getForCFDI()`, `getFullAddress()`

### Testing

See: `.claude/plans/how-to-test-company-settings.md`

**Quick test:**
```bash
# Seed initial data
npx ts-node src/scripts/seed-company-settings.ts

# Test GET endpoint
curl http://localhost:4000/api/company-settings
```

---

## 👤 2.2 Extend Collaborator Entity

**Status:** ✅ **COMPLETED**
**Completion Date:** 20260102

### Implementation Summary

Extended `CollaboratorEntity` with CFDI-required fields:

- [x] `fiscalAddress?: AddressVO` - Fiscal address (if different from residence)
- [x] `taxZipCode?: string` - Tax zip code for CFDI
- [x] `contractType?: SATContractType` - Contract type SAT (01, 02, etc.)
- [x] `regimeType?: SATRegimeType` - Regime type SAT (02, 03, etc.)
- [x] `fiscalRegime?: SATFiscalRegime` - Fiscal regime (605)
- [x] `bank?: string` - Bank for payroll payment
- [x] `bankAccount?: string` - Bank account for payment

**Note:** Existing fields reused for CFDI:
- `col_code` → `employeeNumber` (via helper method)
- `contractDate` → `startDateLaborRelations` (via helper method)
- `curp` → already existed
- `imssNumber` → `nss` (via helper method)

### Implementation Checklist

- [x] **Domain Layer**
  - [x] Update `CollaboratorEntity` interface with CFDI fields
  - [x] Update `CollaboratorProps` interface
  - [x] Add CFDI helper methods (`getTaxZipCode`, `getEmployeeNumber`, etc.)

- [x] **Infrastructure Layer**
  - [x] Update `CollaboratorModel` schema with new fields
  - [x] Add SAT enum validations to schema

- [x] **Files Modified**
  - [x] `src/domain/entities/collaborator.entity.ts`
  - [x] `src/infrastructure/db/mongo/models/collaborator.model.ts`

### Validation Rules

**CURP Format:**
- Length: 18 characters
- Format: `AAAA######AAAAAA##` (letters + numbers)
- Example: `GARC850101HDFMRR09`

**SAT Catalog Fields:**
- `entidadNacimiento`: Must exist in SAT federal entity catalog
- `tipoRegimen`: Must be valid SAT regime code ("02", "03", "04", "13")
- `origenRecurso`: Must be "IP" (Income Payment), "IM" (Mixed Income), or "IF" (Federal Income)

### Migration Strategy

```typescript
// Set default values for existing collaborators
{
  curp: null, // Will need manual update
  tipoRegimen: "02", // Default: Employees, labor law
  sindicalizado: false,
  riesgoTrabajo: 1, // Default: Class I (minimum risk)
  origenRecurso: "IP" // Default: Income Payment
}
```

---

## 💼 2.3 Extend Employment Entity

**Status:** ✅ **COMPLETED**
**Completion Date:** 20260102

### Implementation Summary

Extended `EmploymentEntity` with CFDI-required fields:

- [x] `journeyType?: SATJourneyType` - Workday type SAT (01 Day, 02 Night, 03 Mixed)
- [x] `cfdiPaymentFrequency?: SATPaymentFrequency` - Payment frequency SAT (04 = Quincenal)

### Implementation Checklist

- [x] **Domain Layer**
  - [x] Update `EmploymentBase` interface
  - [x] Update `EmploymentEntity` class
  - [x] Add SAT enum types

- [x] **Infrastructure Layer**
  - [x] Update `EmploymentModel` schema
  - [x] Add SAT enum validations

- [x] **Files Modified**
  - [x] `src/domain/entities/employment.entity.ts`
  - [x] `src/infrastructure/db/mongo/models/employment.model.ts`

### SAT Catalog Values

**c_TipoContrato (Contract Type):**
- `01`: Permanent
- `02`: Temporary
- `03`: Per season
- `04`: Training
- `05`: Trial period
- `06`: Temporary replacement
- `07`: Determined time
- `08`: Indeterminate time
- `09`: Per work
- `10`: Initial training
- `99`: Other

**c_TipoJornada (Workday Type):**
- `01`: Daytime shift
- `02`: Night shift
- `03`: Mixed shift
- `04`: By hour
- `05`: Reduced workday
- `06`: Continuous
- `07`: Split
- `08`: Emergency
- `99`: Other

### Default Values for HVP

Based on HVP's typical employment patterns:
```typescript
{
  tipoContrato: "01", // Permanent (most employees)
  tipoJornada: "03"   // Mixed shift (veterinary hospital hours)
}
```

---

## 📚 2.4 SAT Catalogs Implementation

**Status:** ✅ **COMPLETED**
**Completion Date:** 20260102

### Implementation Summary

Created comprehensive SAT catalog enums and service:

- [x] `SATContractType` - Contract types (01-99)
- [x] `SATRegimeType` - Regime types (02-13)
- [x] `SATJourneyType` - Workday types (01-99)
- [x] `SATPaymentFrequency` - Payment frequencies (01-99)
- [x] `SATFiscalRegime` - Fiscal regimes (605, 616)
- [x] `SATWorkRiskClass` - Work risk classes (1-5)
- [x] `SATResourceOrigin` - Resource origin (IP, IM, IF)
- [x] `SATFederalEntity` - Mexican states (AGU, BCN, YUC, etc.)

**Note:** Perception and deduction types will be implemented in Phase 3 (Payroll Schema)

### Files Created
- `src/domain/enums/sat-cfdi.enum.ts` - All SAT catalog enums
- `src/domain/services/sat-catalog.service.ts` - Validation and lookup service
- `src/domain/services/index.ts` - Service exports

---

## 🔄 2.5 Migration Scripts

**Status:** ✅ **COMPLETED**
**Completion Date:** 20260102

### Implementation Summary

Created unified migration script for CFDI fields:

- [x] `src/scripts/migrate-cfdi-fields.ts` - Migrates both Collaborators and Employments

### Default Values Applied

**Collaborator:**
- `contractType`: "01" (Permanent)
- `regimeType`: "02" (Salaries)
- `fiscalRegime`: "605" (Sueldos y Salarios)

**Employment:**
- `journeyType`: "03" (Mixed)
- `cfdiPaymentFrequency`: "04" (Quincenal)

### Usage

```bash
npx ts-node src/scripts/migrate-cfdi-fields.ts
```

---

## ✅ Phase 2 Success Criteria

**Phase complete when:**
- [x] CompanySettings functional with seed data ✅
- [x] Collaborator extended with CFDI fields ✅
- [x] Employment extended with SAT fields ✅
- [x] SAT catalogs implemented ✅
- [x] Migration script created ✅
- [ ] All existing tests pass (pending verification)
- [ ] Migration run on staging/production (pending deployment)

---

## 📊 Progress Summary

**Overall Phase 2 Progress:** 100% (All sections complete)

| Section | Status | Progress |
|---------|--------|----------|
| 2.1 CompanySettings | ✅ Complete | 100% |
| 2.1b Address VO Unified | ✅ Complete | 100% |
| 2.2 Extend Collaborator | ✅ Complete | 100% |
| 2.3 Extend Employment | ✅ Complete | 100% |
| 2.4 SAT Catalogs | ✅ Complete | 100% |
| 2.5 Migrations | ✅ Complete | 100% |

---

## 🔗 Related Documents

- [Master Plan](./20260102-GH9-cfdi-facturama-integration.md)
- [CFDI Data Mapping](../../docs/cfdi/data-mapping.md)
- [TypeScript Interfaces](../../docs/cfdi/interfaces-spec.md)
- [SAT Catalogs Reference](../../docs/cfdi/sat-catalogs.md)

---

## 🖥️ Frontend Tasks

**¿Cambios breaking?** No
**¿Bloqueante para continuar con SP3?** No

### Campos nuevos disponibles (todos opcionales):

**Collaborator:**
- `fiscalAddress` - Dirección fiscal
- `taxZipCode` - CP fiscal
- `contractType` - Tipo de contrato SAT
- `regimeType` - Tipo de régimen SAT
- `fiscalRegime` - Régimen fiscal
- `bank` - Banco para nómina
- `bankAccount` - Cuenta bancaria

**Employment:**
- `journeyType` - Tipo de jornada SAT
- `cfdiPaymentFrequency` - Periodicidad de pago SAT

### Tareas Frontend (cuando se requiera):
- [ ] Agregar sección "Datos Fiscales" en formulario de Collaborator
- [ ] Agregar campos SAT en formulario de Employment
- [ ] Mostrar nuevos campos en vista de detalle

**Nota:** Estas tareas NO son bloqueantes. El frontend actual sigue funcionando. Implementar cuando se necesite capturar estos datos.

---

## 🚀 Deploy Checklist

- [ ] Commit realizado
- [ ] Push a branch
- [ ] PR / Merge a main
- [ ] Deploy a staging
- [ ] Migración en staging: `heroku run npm run migrate:cfdi --app staging`
- [ ] Verificar GET /api/collaborators en staging
- [ ] Deploy a producción
- [ ] Migración en producción: `heroku run npm run migrate:cfdi --app production`
- [ ] Verificar GET /api/collaborators en producción

---

**Last Updated:** 2026-01-02
**Next Phase:** SP3 - New Payroll Schema (CFDI Value Objects)
