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

- [ ] CompanySettings aggregate functional
- [ ] Collaborator entity extended with CFDI fields
- [ ] Employment entity extended with SAT catalog fields
- [ ] SAT catalogs implemented and validated
- [ ] Migration scripts for existing data

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

**Status:** 🔲 **PENDING**
**Next Up:** Start this after Phase 2.1 completion

### Required CFDI Fields

Add 9 new fields to `CollaboratorEntity`:

- [ ] `curp: string` (REQUIRED) - Clave Única de Registro de Población
- [ ] `nss?: string` - Número de Seguridad Social (IMSS)
- [ ] `entidadNacimiento?: string` - Federal entity of birth (3 chars, SAT catalog)
- [ ] `periodoIngreso?: Date` - Date of entry into current position
- [ ] `añosServicio?: number` - Years of service
- [ ] `tipoRegimen?: string` - Regime type (SAT catalog: "02", "03", etc.)
- [ ] `sindicalizado?: boolean` - Unionized status
- [ ] `riesgoTrabajo?: number` - Work risk class (1-5)
- [ ] `origenRecurso?: string` - Resource origin ("IP", "IM", "IF")

### Implementation Checklist

- [ ] **Domain Layer**
  - [ ] Update `CollaboratorEntity` interface
  - [ ] Add validation rules for CURP format
  - [ ] Add validation for SAT catalog fields

- [ ] **Infrastructure Layer**
  - [ ] Update `CollaboratorModel` schema
  - [ ] Create migration script for existing data

- [ ] **Application Layer**
  - [ ] Update `CollaboratorDTO`
  - [ ] Update `CollaboratorService` validation

- [ ] **Presentation Layer**
  - [ ] Update API documentation
  - [ ] Test endpoints with new fields

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

**Status:** 🔲 **PENDING**

### Required CFDI Fields

Add 2 new fields to `EmploymentEntity`:

- [ ] `tipoContrato: string` (REQUIRED) - Contract type (SAT catalog c_TipoContrato)
- [ ] `tipoJornada: string` (REQUIRED) - Workday type (SAT catalog c_TipoJornada)

### Implementation Checklist

- [ ] **Domain Layer**
  - [ ] Update `EmploymentEntity` interface
  - [ ] Add SAT catalog validation

- [ ] **Infrastructure Layer**
  - [ ] Update `EmploymentModel` schema
  - [ ] Create migration script

- [ ] **Application Layer**
  - [ ] Update `EmploymentDTO`
  - [ ] Update `EmploymentService` validation

- [ ] **Presentation Layer**
  - [ ] Update API documentation
  - [ ] Test endpoints

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

**Status:** 🔲 **PENDING**

### Required Catalogs

Implement these SAT catalogs as enums/constants:

- [ ] `c_TipoPercepcion` - Perception types (001-055)
- [ ] `c_TipoDeduccion` - Deduction types (001-107)
- [ ] `c_TipoOtrosPagos` - Other payments types (001-999)
- [ ] `c_TipoContrato` - Contract types (01-99)
- [ ] `c_TipoJornada` - Workday types (01-99)
- [ ] `c_TipoRegimen` - Regime types (02-13)
- [ ] `c_OrigenRecurso` - Resource origin (IP, IM, IF)
- [ ] `c_RiesgoPuesto` - Work risk classes (1-5)
- [ ] `c_Estado` - Federal entities (AGU, BCN, YUC, etc.)

### Implementation Structure

```typescript
// src/domain/enums/sat-catalogs.ts
export enum SATPerceptionType {
  SALARIO = "001",
  GRATIFICACION = "002",
  AGUINALDO = "003",
  // ... etc
}

export enum SATDeductionType {
  ISR = "002",
  IMSS = "001",
  // ... etc
}

// src/application/services/sat-catalog.service.ts
export class SATCatalogService {
  validatePerceptionType(code: string): boolean;
  validateDeductionType(code: string): boolean;
  getPerceptionName(code: string): string;
  // ... etc
}
```

### Implementation Checklist

- [ ] Create SAT catalog enums
- [ ] Create `SATCatalogService`
- [ ] Create catalog validators
- [ ] Add catalog documentation
- [ ] Create tests for validators

### Catalog Documentation

Create reference docs:
- [ ] `docs/sat-catalogs/percepciones.md`
- [ ] `docs/sat-catalogs/deducciones.md`
- [ ] `docs/sat-catalogs/otros-pagos.md`
- [ ] `docs/sat-catalogs/tipos-contrato.md`

---

## 🔄 2.5 Migration Scripts

**Status:** 🔲 **PENDING**

### Required Migrations

- [ ] **Collaborator Migration**
  - Add CFDI fields with default values
  - Script: `src/scripts/migrate-collaborator-cfdi-fields.ts`

- [ ] **Employment Migration**
  - Add contract/workday types
  - Script: `src/scripts/migrate-employment-cfdi-fields.ts`

### Migration Script Template

```typescript
// src/scripts/migrate-collaborator-cfdi-fields.ts
import mongoose from "mongoose";
import { CollaboratorModel } from "../infrastructure/db/mongo/models";

async function migrateCollaboratorCfdiFields() {
  console.log("🔄 Starting Collaborator CFDI fields migration...");

  const result = await CollaboratorModel.updateMany(
    { curp: { $exists: false } },
    {
      $set: {
        curp: null, // Requires manual update
        tipoRegimen: "02",
        sindicalizado: false,
        riesgoTrabajo: 1,
        origenRecurso: "IP"
      }
    }
  );

  console.log(`✅ Updated ${result.modifiedCount} collaborators`);
}
```

---

## ✅ Phase 2 Success Criteria

**Phase complete when:**
- [x] CompanySettings functional with seed data
- [ ] Collaborator extended with 9 CFDI fields
- [ ] Employment extended with 2 SAT fields
- [ ] SAT catalogs implemented
- [ ] All migrations run successfully
- [ ] All existing tests pass
- [ ] New fields validated in API

---

## 📊 Progress Summary

**Overall Phase 2 Progress:** 25% (1/4 sections complete)

| Section | Status | Progress |
|---------|--------|----------|
| 2.1 CompanySettings | ✅ Complete | 100% |
| 2.2 Extend Collaborator | 🔲 Pending | 0% |
| 2.3 Extend Employment | 🔲 Pending | 0% |
| 2.4 SAT Catalogs | 🔲 Pending | 0% |
| 2.5 Migrations | 🔲 Pending | 0% |

---

## 🔗 Related Documents

- [Master Plan](./20260101-MASTER-PLAN-cfdi-migration-20260102.md)
- [CFDI Data Mapping](./cfdi-payroll-data-mapping-20260102.md)
- [TypeScript Interfaces](./typescript-interfaces-20260102.md)
- [SAT Catalogs Reference](./sat-catalogs-20260102.md)
- [CompanySettings Testing Guide](./how-to-test-company-settings.md)

---

**Last Updated:** 20260102
