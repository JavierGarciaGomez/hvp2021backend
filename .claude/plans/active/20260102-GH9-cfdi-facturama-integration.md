---
title: "CFDI/Facturama Integration for Payroll"
issue: "https://github.com/JavierGarciaGomez/hvp2021backend/issues/9"
created: "2026-01-02"
status: "active"
type: "plan"
subplans: ["SP2", "SP3", "SP4", "SP5", "SP6"]
assignee: "Backend Team"
priority: "high"
estimated_hours: 120
tags: ["cfdi", "facturama", "payroll", "tax", "ddd", "api-integration"]
---

# MASTER PLAN: Payroll System Migration to CFDI/Facturama Integration

**Creation Date:** 20260102
**Final Objective:** Enable CFDI stamping through Facturama integration
**Status:** 🟢 In Progress (SP2: 100% ✅)

---

## 🎯 Final Goal

**Complete workflow:**
1. Create payroll calculation
2. Review and approve payroll
3. **Transform payroll data to CFDI format**
4. **Send to Facturama API for stamping (timbrado)**
5. Store CFDI UUID and allow cancellation

---

## 📋 Subplan Index

| Phase | Subplan | Status | Progress | Description |
|-------|---------|--------|----------|-------------|
| Phase 2 | [SP2-new-resources](./20260102-GH9-SP2-new-resources.md) | ✅ Complete | 100% | CompanySettings, Collaborator, Employment, SAT Catalogs |
| Phase 3 | SP3-payroll-schema | 🔲 Pending | 0% | Complex value objects for CFDI |
| Phase 4 | SP4-data-migration | 🔲 Pending | 0% | Critical migration scripts |
| Phase 5 | SP5-calculation-refactor | 🔲 Pending | 0% | Large refactor of payroll calculations |
| Phase 6 | SP6-facturama-integration | 🔲 Pending | 0% | ⭐ Final goal - API integration |

**Phases covered in master plan only:**
- Phase 1: Analysis & Design ✅ COMPLETED
- Phase 7: Cleanup & Testing (after Phase 6)

---

## 🏛️ Domain-Driven Design (DDD) Principles

**CRITICAL: Follow DDD best practices WITHOUT breaking existing code**

### Core DDD Guidelines for This Project

#### 1. **Preserve Existing Bounded Contexts**
- ✅ Keep current layer structure (Domain → Application → Infrastructure → Presentation)
- ✅ Don't break existing aggregates (Collaborator, Employment, Payroll)
- ✅ Extend entities with new properties, don't create parallel structures

#### 2. **New Value Objects (Immutable)**
```typescript
// NEW Value Objects (following existing patterns)
- PayrollCfdiData (snapshot of employee/company data)
- PayrollPerception (with SAT codes + calculation metadata)
- PayrollDeduction (with SAT codes + calculation metadata)
- PayrollOtherPayment
- CalculationMetadata (for frontend tooltips)
```

#### 3. **Domain Services (Business Logic)**
```typescript
// NEW Domain Services
- PerceptionCalculationService (pure business logic)
- DeductionCalculationService (pure business logic)
- CfdiDataSnapshotService (creates immutable snapshots)
- TaxCalculationService (ISR, IMSS calculations)
```

#### 4. **Application Services (Orchestration)**
```typescript
// REFACTOR Application Services
- PayrollCalculationService (orchestrates domain services)
- PayrollMigrationService (orchestrates migration)
- FacturamaIntegrationService (orchestrates CFDI generation)
```

#### 5. **Aggregates & Entities**
```typescript
// EXTEND existing entities (don't replace)
- CollaboratorEntity: Add fiscal fields
- EmploymentEntity: Add CFDI-required fields
- PayrollEntity: Add cfdiData, perceptions[], deductions[]

// NEW Aggregate Root
- CompanySettings (singleton aggregate)
```

#### 6. **Repository Pattern**
```typescript
// Keep existing repositories, extend as needed
- CollaboratorRepository: Add queries for fiscal data validation
- PayrollRepository: Add queries for CFDI-ready payrolls

// NEW Repository
- CompanySettingsRepository (singleton pattern)
```

#### 7. **Domain Events (Optional but recommended)**
```typescript
// Future consideration for Phase 6
- PayrollCalculatedEvent
- PayrollApprovedEvent
- CfdiStampedEvent
- CfdiCancelledEvent
```

### DDD Dos and Don'ts

✅ **DO:**
- Follow existing naming conventions
- Use value objects for complex concepts (cfdiData, perceptions)
- Keep business logic in domain layer
- Use factories for complex object creation
- Validate invariants in entities
- Create domain services for cross-aggregate logic

❌ **DON'T:**
- Create new parallel entities when you can extend existing ones
- Put business logic in controllers or repositories
- Break existing API contracts without versioning
- Create anemic domain models (getters/setters only)
- Mix infrastructure concerns with domain logic

---

## Project Overview

### Current Problem
- Payroll schema designed only for internal calculations
- Missing fiscal data required by SAT/Facturama
- Perceptions and deductions lack metadata to explain calculations
- No static snapshot of data needed for CFDI (comes from Collaborator, Employment, etc.)
- **No integration with Facturama for CFDI stamping**

### Proposed Solution
1. **New CompanySettings model** for company fiscal data
2. **Extend existing models** (Collaborator, Employment) with CFDI fields
3. **New Payroll schema** with:
   - `cfdiData`: Static snapshot at calculation time
   - Perceptions/deductions with SAT codes + calculation metadata
   - Fields for frontend tooltips
4. **Progressive migration** with transition schema
5. **Complete refactor** of `calculatePayrolls` and related services
6. **⭐ Facturama integration** for CFDI stamping
7. **Workflow:** Create → Approve → Stamp → Store UUID

---

## PHASE 1: Analysis & Design

**Duration:** Preparation
**Subplan:** `01-analysis-design.md`

### 1.1 Detect New Resources Needed

**New resources:**
- [ ] `CompanySettings` (new singleton model)
- [ ] SAT catalogs (perception types, deduction types, contract types, etc.)
- [ ] Facturama API interfaces

**Resources to extend:**
- [ ] `Collaborator` (9 new fields)
- [ ] `Employment` (2 new fields)
- [ ] `Payroll` (complete restructure)

### 1.2 Field Mapping by Resource

| Resource | New Fields | Purpose |
|----------|------------|---------|
| **CompanySettings** | name, rfc, employerRegistration, expeditionZipCode, federalEntityKey | HVP fiscal data |
| **Collaborator** | employeeNumber, curp, nss, startDateLaborRelations, contractType, regimeType, fiscalRegime, taxZipCode, bank, bankAccount | Employee fiscal data |
| **Employment** | journeyType, paymentFrequency | Labor data for CFDI |
| **Payroll** | See Phase 3 | Complete restructure |

### 1.3 Architecture Design (DDD Layers)

```
┌─────────────────────────────────────────────────────────┐
│ PRESENTATION LAYER (Controllers, Routes, DTOs)          │
│ - PayrollController                                     │
│ - FacturamaController (NEW)                             │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│ APPLICATION LAYER (Services, Use Cases)                 │
│ - PayrollCalculationService (REFACTOR)                  │
│ - PayrollMigrationService (NEW)                         │
│ - FacturamaIntegrationService (NEW)                     │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│ DOMAIN LAYER (Entities, Value Objects, Domain Services) │
│                                                          │
│ Aggregates:                                              │
│ - PayrollEntity (EXTEND)                                 │
│ - CollaboratorEntity (EXTEND)                            │
│ - EmploymentEntity (EXTEND)                              │
│ - CompanySettingsEntity (NEW)                            │
│                                                          │
│ Value Objects:                                           │
│ - PayrollCfdiData (NEW)                                  │
│ - PayrollPerception (NEW)                                │
│ - PayrollDeduction (NEW)                                 │
│ - CalculationMetadata (NEW)                              │
│                                                          │
│ Domain Services:                                         │
│ - PerceptionCalculationService (NEW)                     │
│ - DeductionCalculationService (NEW)                      │
│ - CfdiDataSnapshotService (NEW)                          │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│ INFRASTRUCTURE LAYER (DB, External APIs)                │
│ - MongoDB Models (extend existing)                       │
│ - Repositories (extend existing)                         │
│ - FacturamaApiClient (NEW)                               │
└─────────────────────────────────────────────────────────┘
                           ▲
                           │
┌─────────────────────────────────────────────────────────┐
│ EXTERNAL SERVICES                                        │
│ - Facturama API (CFDI Stamping)                          │
│ - SAT Catalogs                                           │
└─────────────────────────────────────────────────────────┘
```

**Phase 1 Outputs:**
- ✅ Complete list of resources and fields
- ✅ Architecture diagram following DDD
- ✅ TypeScript interface specifications
- ✅ SAT catalog validation plan

---

## PHASE 2: New Resources

**Duration:** Implementation
**Subplan:** `02-new-resources.md`
**Prerequisite:** Phase 1 complete

### 2.1 Create CompanySettings (New Aggregate Root)

**DDD Pattern:** Singleton Aggregate

```typescript
// domain/entities/company-settings.entity.ts
export class CompanySettingsEntity implements BaseEntity {
  id: string;
  name: string;
  rfc: string;
  employerRegistration: string; // IMSS
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: Address; // Value Object
  // ... timestamps
}

// domain/repositories/company-settings.repository.interface.ts
export interface ICompanySettingsRepository {
  get(): Promise<CompanySettingsEntity>; // Singleton
  update(settings: CompanySettingsEntity): Promise<void>;
}

// application/services/company-settings.service.ts
export class CompanySettingsService {
  private cache?: CompanySettingsEntity;

  async get(): Promise<CompanySettingsEntity> {
    if (!this.cache) {
      this.cache = await this.repository.get();
    }
    return this.cache;
  }
}
```

**Tasks:**
- [ ] Entity: `CompanySettingsEntity`
- [ ] Model: `CompanySettingsModel` (MongoDB)
- [ ] DTO: `CompanySettingsDto`
- [ ] Repository: `CompanySettingsRepository`
- [ ] Service: `CompanySettingsService` (singleton + cache)
- [ ] Seed: Script to create initial HVP record
- [ ] Controller: `CompanySettingsController` (read-only for normal users)

### 2.2 Extend Collaborator Entity

**DDD Pattern:** Extend existing aggregate, don't replace

**New fields:**
```typescript
// domain/entities/collaborator.entity.ts (EXTEND)
export class CollaboratorEntity {
  // ... existing fields ...

  // Identification (NEW)
  employeeNumber: string;
  curp: string;
  nss: string; // Social Security Number

  // Labor relationship (NEW)
  startDateLaborRelations: Date;
  contractType: string; // "01", "02" (SAT catalog)
  regimeType: string;   // "02" = Salaries

  // Fiscal data (NEW)
  fiscalRegime: string;  // "605" = Salaries
  taxZipCode: string;

  // Banking (NEW)
  bank: string;
  bankAccount: string;
}
```

**Tasks:**
- [ ] Update Entity, Model, DTO
- [ ] Create migration scripts
- [ ] Update validations
- [ ] Update tests

### 2.3 Extend Employment Entity

**New fields:**
```typescript
// domain/entities/employment.entity.ts (EXTEND)
export class EmploymentEntity {
  // ... existing fields ...

  journeyType: string;       // "01"=Day, "02"=Night
  paymentFrequency: string;  // "04"=Biweekly
}
```

**Tasks:**
- [ ] Update Entity, Model, DTO
- [ ] Create enum `JourneyType`
- [ ] Create enum `PaymentFrequency`
- [ ] Update tests

### 2.4 Create SAT Catalogs

**DDD Pattern:** Value Objects + Domain Service

```typescript
// domain/value-objects/sat-catalog.vo.ts
export class SATPerceptionType {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}

// domain/services/sat-catalog.service.ts
export class SATCatalogService {
  getPerceptionType(code: string): SATPerceptionType;
  getDeductionType(code: string): SATDeductionType;
  validateContractType(code: string): boolean;
  // ...
}
```

**Tasks:**
- [ ] `SATCatalogService` for catalog queries
- [ ] Interfaces for each catalog
- [ ] Constants with common values
- [ ] Validators per catalog

**Phase 2 Outputs:**
- ✅ CompanySettings functional with seed
- ✅ Collaborator and Employment extended
- ✅ SAT catalogs implemented
- ✅ Migration scripts for existing data

---

## PHASE 3: New Payroll Schema

**Duration:** Design + Implementation
**Subplan:** `03-payroll-schema.md`
**Prerequisite:** Phase 2 complete

### 3.1 Transition Schema (v2)

**Strategy:** Add new fields WITHOUT removing legacy fields (backward compatible)

```typescript
// domain/entities/payroll.entity.ts (TRANSITION v2)
export class PayrollEntity {
  // ===== EXISTING FIELDS (keep) =====
  generalData: PayrollGeneralData;        // LEGACY
  earnings: PayrollEarnings;              // LEGACY
  deductions: PayrollDeductions;          // LEGACY
  totals: PayrollTotals;                  // LEGACY
  contextData: PayrollContextData;        // LEGACY

  // ===== NEW FIELDS =====
  cfdiData: PayrollCfdiData;             // NEW (Value Object)
  perceptions: PayrollPerception[];       // NEW (Value Object array)
  deductionsCfdi: PayrollDeduction[];     // NEW (different name to avoid conflict)
  otherPayments: PayrollOtherPayment[];   // NEW (Value Object array)
  cfdiTotals: PayrollCfdiTotals;         // NEW (Value Object)

  // CFDI Metadata
  payrollType: 'O' | 'E';                // NEW: Ordinary/Extraordinary
  folio?: string;                         // NEW
  cfdiUuid?: string;                      // NEW: UUID from stamping
  cfdiStatus?: CfdiStatus;                // NEW: pending/stamped/cancelled
}
```

### 3.2 Value Object: cfdiData (Static Snapshot)

**DDD Pattern:** Value Object (immutable)

**Purpose:** Capture Collaborator, Employment, Company data that may change in the future

```typescript
// domain/value-objects/payroll-cfdi-data.vo.ts
export class PayrollCfdiData {
  readonly employee: {
    fullName: string;
    rfc: string;
    curp: string;
    nss: string;
    employeeNumber: string;
    fiscalRegime: string;        // "605"
    taxZipCode: string;

    // Labor relationship
    startDateLaborRelations: Date;
    contractType: string;        // "01", "02"
    regimeType: string;          // "02"

    // Banking
    bank: string;
    bankAccount: string;
  };

  readonly employment: {
    jobTitle: string;
    journeyType: string;         // "01"
    paymentFrequency: string;    // "04"
    baseSalary: number;
    dailySalary: number;
    paymentType: HRPaymentType;
  };

  readonly company: {
    name: string;
    rfc: string;
    employerRegistration: string;
    expeditionZipCode: string;
    federalEntityKey: string;
  };

  readonly period: {
    startDate: Date;
    endDate: Date;
    paymentDate: Date;
    daysPaid: number;
  };

  constructor(data: PayrollCfdiDataProps) {
    // Ensure immutability
    Object.freeze(this);
  }
}
```

### 3.3 Value Object: PayrollPerception

**DDD Pattern:** Value Object with calculation metadata

**Purpose:** Map to SAT catalog + include metadata for tooltips

```typescript
// domain/value-objects/payroll-perception.vo.ts
export class PayrollPerception {
  // SAT Identification
  readonly perceptionType: string;        // SAT code: "001", "002", etc.
  readonly code: string;                  // Internal: "SDI", "AGUINALDO"
  readonly description: string;           // "Integrated Daily Salary"

  // Amounts (CFDI)
  readonly taxedAmount: number;           // Taxable amount
  readonly exemptAmount: number;          // Exempt amount
  readonly totalAmount: number;           // taxedAmount + exemptAmount

  // Metadata for tooltip (frontend)
  readonly calculation: CalculationMetadata;

  // Context
  readonly isExtraordinary?: boolean;
  readonly relatedConcept?: string;       // Legacy concept ID

  constructor(props: PayrollPerceptionProps) {
    // Validate invariants
    if (props.totalAmount !== props.taxedAmount + props.exemptAmount) {
      throw new DomainException('Total must equal taxed + exempt');
    }
    Object.freeze(this);
  }
}

// domain/value-objects/calculation-metadata.vo.ts
export class CalculationMetadata {
  readonly formula?: string;              // "baseSalary * daysPaid"
  readonly breakdown?: CalculationStep[];
  readonly umaLimit?: number;
  readonly exemptDays?: number;
  readonly notes?: string;

  constructor(props: CalculationMetadataProps) {
    Object.freeze(this);
  }
}

export interface CalculationStep {
  step: number;
  description: string;
  operation: string;             // "1500 * 15"
  result: number;
}
```

**Example tooltip data:**
```typescript
new PayrollPerception({
  perceptionType: "002",
  code: "AGUINALDO",
  description: "End-Year Bonus",
  taxedAmount: 2500.00,
  exemptAmount: 3256.71,
  totalAmount: 5756.71,
  calculation: new CalculationMetadata({
    formula: "(baseSalary / 365) * 15 days",
    breakdown: [
      {
        step: 1,
        description: "Total aguinaldo calculated",
        operation: "(1500 / 365) * 15",
        result: 5756.71
      },
      {
        step: 2,
        description: "Exemption limit (30 UMA)",
        operation: "108.57 * 30",
        result: 3257.10
      },
      {
        step: 3,
        description: "Exempt amount (minimum)",
        operation: "min(5756.71, 3257.10)",
        result: 3256.71
      },
      {
        step: 4,
        description: "Taxable amount",
        operation: "5756.71 - 3256.71",
        result: 2500.00
      }
    ],
    umaLimit: 3257.10,
    exemptDays: 30,
    notes: "First 30 UMA days exempt per ISR Law"
  })
})
```

### 3.4 Value Object: PayrollDeduction

```typescript
// domain/value-objects/payroll-deduction.vo.ts
export class PayrollDeduction {
  readonly deductionType: string;         // SAT code: "001", "002"
  readonly code: string;                  // "IMSS", "ISR"
  readonly description: string;
  readonly amount: number;
  readonly calculation: CalculationMetadata;
  readonly relatedConcept?: string;

  constructor(props: PayrollDeductionProps) {
    Object.freeze(this);
  }
}
```

### 3.5 Value Object: PayrollOtherPayment

```typescript
// domain/value-objects/payroll-other-payment.vo.ts
export class PayrollOtherPayment {
  readonly otherPaymentType: string;      // SAT: "002" (Employment subsidy)
  readonly code: string;
  readonly description: string;
  readonly amount: number;
  readonly employmentSubsidy?: {
    amount: number;
  };

  constructor(props: PayrollOtherPaymentProps) {
    Object.freeze(this);
  }
}
```

### 3.6 Final Schema (Post-migration v3)

**Once all historical records are migrated:**

```typescript
// domain/entities/payroll.entity.ts (FINAL v3)
export class PayrollEntity {
  // Base fields
  id: string;
  collaboratorId: string;
  employmentId: string;
  periodStartDate: Date;
  periodEndDate: Date;
  payrollStatus: PayrollStatus;

  // CFDI Core Data (Value Objects)
  cfdiData: PayrollCfdiData;
  perceptions: PayrollPerception[];
  deductions: PayrollDeduction[];
  otherPayments: PayrollOtherPayment[];
  totals: PayrollCfdiTotals;

  // CFDI Metadata
  payrollType: 'O' | 'E';
  folio?: string;
  cfdiUuid?: string;
  cfdiStatus?: CfdiStatus;

  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
  updatedBy: string;

  // REMOVED:
  // ❌ generalData (replaced by cfdiData)
  // ❌ earnings (replaced by perceptions)
  // ❌ deductions (old) (replaced by deductions)
  // ❌ totals (old) (replaced by cfdiTotals)
  // ❌ contextData (moved to internal metadata)
}
```

**Phase 3 Outputs:**
- ✅ Complete TypeScript interfaces
- ✅ Updated Mongoose schemas
- ✅ Validators implemented
- ✅ Schema tests

---

## PHASE 4: Data Migration

**Duration:** Implementation + Testing
**Subplan:** `04-data-migration.md`
**Prerequisite:** Phase 3 complete

### 4.1 Existing Data Analysis

- [ ] Count payroll records in DB
- [ ] Identify payrolls with missing data
- [ ] Analyze relationship integrity (collaborator, employment)
- [ ] List edge cases to handle

### 4.2 Migration Scripts

**4.2.1 Collaborator Migration**
```typescript
// scripts/migrate-collaborators.ts
// - Assign employeeNumber to collaborators without number
// - Assign default values to contractType, regimeType
// - Validate CURP, NSS, RFC
// - Report collaborators with missing data
```

**4.2.2 Employment Migration**
```typescript
// scripts/migrate-employments.ts
// - Assign journeyType = "01" (default: Day)
// - Assign paymentFrequency = "04" (default: Biweekly)
```

**4.2.3 Payroll Migration (Legacy → v2)**
```typescript
// scripts/migrate-payrolls.ts
// For each existing payroll:
//   1. Get snapshot of collaborator, employment, company
//   2. Create cfdiData from snapshot
//   3. Convert earnings → perceptions
//   4. Convert deductions → deductions (new format)
//   5. Calculate otherPayments if applicable
//   6. Keep legacy fields intact
//   7. Validate result
```

### 4.3 Conversion Functions (Domain Services)

**DDD Pattern:** Domain Service for migration logic

```typescript
// domain/services/payroll-migration.service.ts

export class PayrollMigrationService {
  /**
   * Converts legacy earnings to perceptions with metadata
   */
  async convertEarningsToPerceptions(
    earnings: PayrollEarnings,
    collaborator: Collaborator,
    employment: Employment
  ): Promise<PayrollPerception[]>;

  /**
   * Converts legacy deductions to deductions with metadata
   */
  async convertDeductionsToDeductions(
    deductions: PayrollDeductions
  ): Promise<PayrollDeduction[]>;

  /**
   * Creates cfdiData snapshot
   */
  async createCfdiDataSnapshot(
    collaborator: Collaborator,
    employment: Employment,
    company: CompanySettings,
    period: { startDate: Date; endDate: Date }
  ): Promise<PayrollCfdiData>;

  /**
   * Migrates single payroll
   */
  async migratePayroll(payrollId: string): Promise<void>;

  /**
   * Migrates all payrolls (batch)
   */
  async migrateAllPayrolls(batchSize: number = 100): Promise<MigrationReport>;
}
```

### 4.4 Migration Execution Plan

**Strategy:** Progressive migration without downtime

1. **Phase 4.4.1: Dry Run**
   - Execute migration in test DB
   - Validate 100% of records
   - Generate error report
   - Fix scripts based on errors

2. **Phase 4.4.2: Production Migration (Hybrid Mode)**
   - Migrate payrolls in batches of 100
   - Keep legacy fields intact
   - Validate each batch before continuing
   - Automatic rollback if validation fails

3. **Phase 4.4.3: Post-Migration Validation**
   - Compare legacy totals vs new
   - Verify 100% of payrolls migrated
   - Generate final report

**Phase 4 Outputs:**
- ✅ Tested migration scripts
- ✅ All historical payrolls migrated to v2
- ✅ Migration report
- ✅ Data integrity validation

---

## PHASE 5: Calculation Refactor

**Duration:** Complete refactor
**Subplan:** `05-calculation-refactor.md`
**Prerequisite:** Phase 4 complete

### 5.1 Refactor `calculatePayrolls`

**DDD Pattern:** Application Service orchestrating Domain Services

**Before:**
```typescript
// Returns legacy earnings
async calculatePayrolls(params): Promise<PayrollEntity[]>
```

**After:**
```typescript
// Returns new format with perceptions/deductions
async calculatePayrolls(params): Promise<PayrollV2Entity[]>
```

**Main changes:**
- [ ] Get snapshot of collaborator, employment, company
- [ ] Create `cfdiData` at calculation start
- [ ] Calculate perceptions → generate `PayrollPerception[]` with metadata
- [ ] Calculate deductions → generate `PayrollDeduction[]` with metadata
- [ ] Calculate other payments
- [ ] Generate calculation breakdown for tooltips
- [ ] Keep current calculation logic (only change output)

### 5.2 Domain Services (Business Logic)

**5.2.1 PerceptionCalculationService**
```typescript
// domain/services/perception-calculation.service.ts
export class PerceptionCalculationService {
  /**
   * Calculates perception with complete metadata
   */
  calculatePerception(
    type: PerceptionType,
    baseData: PayrollBaseData,
    context: CalculationContext
  ): PayrollPerception;

  /**
   * Specific examples:
   */
  calculateSalary(...): PayrollPerception;
  calculateAguinaldo(...): PayrollPerception;
  calculateOvertime(...): PayrollPerception;
  calculateVacationBonus(...): PayrollPerception;
}
```

**5.2.2 DeductionCalculationService**
```typescript
// domain/services/deduction-calculation.service.ts
export class DeductionCalculationService {
  calculateIMSS(...): PayrollDeduction;
  calculateISR(...): PayrollDeduction;
  calculateOtherDeduction(...): PayrollDeduction;
}
```

**5.2.3 CfdiDataSnapshotService**
```typescript
// domain/services/cfdi-data-snapshot.service.ts
export class CfdiDataSnapshotService {
  /**
   * Creates immutable snapshot for CFDI
   */
  async createSnapshot(
    collaborator: Collaborator,
    employment: Employment,
    company: CompanySettings,
    period: PayrollPeriod
  ): Promise<PayrollCfdiData>;
}
```

**5.2.4 TooltipMetadataService**
```typescript
// domain/services/tooltip-metadata.service.ts
export class TooltipMetadataService {
  /**
   * Generates calculation metadata for tooltips
   */
  generateCalculationBreakdown(
    concept: string,
    steps: CalculationStep[]
  ): CalculationMetadata;
}
```

### 5.3 Update Endpoints

**Affected endpoints:**
- `POST /api/payrolls/calculate` → Return new format
- `POST /api/payrolls` → Save new format
- `GET /api/payrolls/:id` → Return new format
- `GET /api/payrolls` → Return new format

**Backward compatibility:**
- [ ] Create response DTOs v1 and v2
- [ ] Option for API versioning (`/api/v2/payrolls`)
- [ ] Or adapt frontend to new format

**Phase 5 Outputs:**
- ✅ `calculatePayrolls` refactored
- ✅ Calculation services with metadata
- ✅ Unit tests for calculations
- ✅ Updated endpoints

---

## PHASE 6: Facturama Integration ⭐

**Duration:** Implementation + Integration Testing
**Subplan:** `06-facturama-integration.md`
**Prerequisite:** Phase 5 complete
**CRITICAL:** This is the final goal of the project

### 6.1 Facturama API Client (Infrastructure Layer)

```typescript
// infrastructure/external-services/facturama-api.client.ts
export class FacturamaApiClient {
  constructor(
    private apiKey: string,
    private apiSecret: string,
    private isSandbox: boolean
  ) {}

  /**
   * Creates and stamps CFDI in Facturama
   */
  async createCfdi(cfdiData: FacturamaCfdiRequest): Promise<FacturamaCfdiResponse>;

  /**
   * Cancels stamped CFDI
   */
  async cancelCfdi(uuid: string, motive: string): Promise<void>;

  /**
   * Gets CFDI status
   */
  async getCfdiStatus(uuid: string): Promise<CfdiStatus>;

  /**
   * Downloads PDF
   */
  async downloadPdf(uuid: string): Promise<Buffer>;

  /**
   * Downloads XML
   */
  async downloadXml(uuid: string): Promise<string>;
}
```

### 6.2 Payroll to CFDI Mapper (Application Layer)

**DDD Pattern:** Application Service (orchestration)

```typescript
// application/services/cfdi-mapper.service.ts
export class CfdiMapperService {
  /**
   * Transforms PayrollEntity to Facturama CFDI format
   */
  async mapPayrollToCfdi(
    payroll: PayrollEntity
  ): Promise<FacturamaCfdiRequest> {
    return {
      NameId: this.getFacturamaNameId(),
      ExpeditionPlace: payroll.cfdiData.company.expeditionZipCode,
      CfdiType: "N",
      PaymentMethod: "PUE",
      Folio: payroll.folio || this.generateFolio(payroll),

      Receiver: {
        Rfc: payroll.cfdiData.employee.rfc,
        Name: payroll.cfdiData.employee.fullName,
        CfdiUse: "CN01",
        FiscalRegime: payroll.cfdiData.employee.fiscalRegime,
        TaxZipCode: payroll.cfdiData.employee.taxZipCode
      },

      Complemento: {
        Payroll: {
          Type: payroll.payrollType,
          PaymentDate: payroll.cfdiData.period.paymentDate,
          InitialPaymentDate: payroll.cfdiData.period.startDate,
          FinalPaymentDate: payroll.cfdiData.period.endDate,
          DaysPaid: payroll.cfdiData.period.daysPaid,

          Issuer: {
            EmployerRegistration: payroll.cfdiData.company.employerRegistration
          },

          Employee: this.mapEmployee(payroll.cfdiData.employee, payroll.cfdiData.employment),

          Perceptions: this.mapPerceptions(payroll.perceptions),

          Deductions: this.mapDeductions(payroll.deductions),

          OtherPayments: this.mapOtherPayments(payroll.otherPayments)
        }
      }
    };
  }

  private mapEmployee(employee, employment): FacturamaEmployee {
    return {
      Curp: employee.curp,
      SocialSecurityNumber: employee.nss,
      StartDateLaborRelations: employee.startDateLaborRelations,
      ContractType: employee.contractType,
      RegimeType: employee.regimeType,
      Unionized: false,
      TypeOfJourney: employment.journeyType,
      EmployeeNumber: employee.employeeNumber,
      Position: employment.jobTitle,
      PositionRisk: "1",
      FrequencyPayment: employment.paymentFrequency,
      Bank: employee.bank,
      BankAccount: employee.bankAccount,
      BaseSalary: employment.baseSalary,
      DailySalary: employment.dailySalary,
      FederalEntityKey: this.cfdiData.company.federalEntityKey
    };
  }

  private mapPerceptions(perceptions: PayrollPerception[]): FacturamaPerception[] {
    return perceptions.map(p => ({
      PerceptionType: p.perceptionType,
      Code: p.code,
      Description: p.description,
      TaxedAmount: p.taxedAmount,
      ExemptAmount: p.exemptAmount
    }));
  }

  // ... similar for deductions and otherPayments
}
```

### 6.3 Facturama Integration Service (Application Layer)

```typescript
// application/services/facturama-integration.service.ts
export class FacturamaIntegrationService {
  constructor(
    private facturamaClient: FacturamaApiClient,
    private cfdiMapper: CfdiMapperService,
    private payrollRepository: PayrollRepository
  ) {}

  /**
   * MAIN WORKFLOW: Approve → Stamp → Store
   */
  async stampPayroll(payrollId: string, userId: string): Promise<StampResult> {
    // 1. Get payroll
    const payroll = await this.payrollRepository.findById(payrollId);

    // 2. Validate payroll is approved
    if (payroll.payrollStatus !== PayrollStatus.Approved) {
      throw new BusinessException('Payroll must be approved before stamping');
    }

    // 3. Check if already stamped
    if (payroll.cfdiUuid) {
      throw new BusinessException('Payroll already stamped');
    }

    // 4. Transform to CFDI format
    const cfdiRequest = await this.cfdiMapper.mapPayrollToCfdi(payroll);

    // 5. Send to Facturama
    const cfdiResponse = await this.facturamaClient.createCfdi(cfdiRequest);

    // 6. Update payroll with UUID
    payroll.cfdiUuid = cfdiResponse.Complement.TaxStamp.Uuid;
    payroll.cfdiStatus = CfdiStatus.Stamped;
    payroll.folio = cfdiResponse.Folio;
    payroll.updatedBy = userId;

    await this.payrollRepository.update(payroll);

    // 7. Return result
    return {
      success: true,
      uuid: cfdiResponse.Complement.TaxStamp.Uuid,
      pdfUrl: cfdiResponse.CfdiPdfUrl,
      xmlUrl: cfdiResponse.CfdiXmlUrl
    };
  }

  /**
   * Cancel stamped CFDI
   */
  async cancelCfdi(
    payrollId: string,
    motive: string,
    userId: string
  ): Promise<void> {
    const payroll = await this.payrollRepository.findById(payrollId);

    if (!payroll.cfdiUuid) {
      throw new BusinessException('Payroll not stamped');
    }

    await this.facturamaClient.cancelCfdi(payroll.cfdiUuid, motive);

    payroll.cfdiStatus = CfdiStatus.Cancelled;
    payroll.updatedBy = userId;

    await this.payrollRepository.update(payroll);
  }

  /**
   * Download PDF
   */
  async downloadPdf(payrollId: string): Promise<Buffer> {
    const payroll = await this.payrollRepository.findById(payrollId);

    if (!payroll.cfdiUuid) {
      throw new BusinessException('Payroll not stamped');
    }

    return await this.facturamaClient.downloadPdf(payroll.cfdiUuid);
  }

  /**
   * Download XML
   */
  async downloadXml(payrollId: string): Promise<string> {
    const payroll = await this.payrollRepository.findById(payrollId);

    if (!payroll.cfdiUuid) {
      throw new BusinessException('Payroll not stamped');
    }

    return await this.facturamaClient.downloadXml(payroll.cfdiUuid);
  }
}
```

### 6.4 New Endpoints (Presentation Layer)

```typescript
// presentation/controllers/facturama.controller.ts
export class FacturamaController {
  /**
   * POST /api/payrolls/:id/stamp
   * Stamps approved payroll
   */
  async stampPayroll(req, res) {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await this.facturamaService.stampPayroll(id, userId);

    return res.json({
      ok: true,
      message: 'Payroll stamped successfully',
      data: result
    });
  }

  /**
   * POST /api/payrolls/:id/cancel-cfdi
   * Cancels stamped CFDI
   */
  async cancelCfdi(req, res) {
    const { id } = req.params;
    const { motive } = req.body;
    const userId = req.user.id;

    await this.facturamaService.cancelCfdi(id, motive, userId);

    return res.json({
      ok: true,
      message: 'CFDI cancelled successfully'
    });
  }

  /**
   * GET /api/payrolls/:id/cfdi/pdf
   * Downloads PDF
   */
  async downloadPdf(req, res) {
    const { id } = req.params;
    const pdf = await this.facturamaService.downloadPdf(id);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="payroll-${id}.pdf"`);
    res.send(pdf);
  }

  /**
   * GET /api/payrolls/:id/cfdi/xml
   * Downloads XML
   */
  async downloadXml(req, res) {
    const { id } = req.params;
    const xml = await this.facturamaService.downloadXml(id);

    res.setHeader('Content-Type', 'application/xml');
    res.setHeader('Content-Disposition', `attachment; filename="payroll-${id}.xml"`);
    res.send(xml);
  }
}
```

### 6.5 Environment Configuration

```bash
# .env
FACTURAMA_API_KEY=your-api-key
FACTURAMA_API_SECRET=your-api-secret
FACTURAMA_SANDBOX=true
FACTURAMA_NAME_ID=1
```

### 6.6 Error Handling

```typescript
// domain/exceptions/facturama.exception.ts
export class FacturamaException extends Error {
  constructor(
    message: string,
    public readonly facturamaError?: any
  ) {
    super(message);
  }
}

// Handle Facturama-specific errors
// - Invalid RFC
// - Missing required fields
// - SAT rejection
// - Network errors
```

**Phase 6 Outputs:**
- ✅ Facturama API client implemented
- ✅ CFDI mapper service functional
- ✅ Integration service with full workflow
- ✅ New endpoints for stamp/cancel/download
- ✅ Tested in Facturama sandbox
- ✅ Error handling implemented

---

## PHASE 7: Cleanup & Testing

**Duration:** Cleanup + QA
**Subplan:** `07-cleanup-testing.md`
**Prerequisite:** Phase 6 complete + Frontend updated

### 7.1 Legacy Field Cleanup

**Once confirmed frontend and system work with new schema:**

- [ ] Remove legacy fields from `PayrollModel`:
  - `generalData`
  - `earnings`
  - `deductions` (legacy)
  - `totals` (legacy)
  - `contextData`

- [ ] Update Entity, DTOs, Interfaces
- [ ] Remove dead code
- [ ] Update documentation

### 7.2 Comprehensive Testing

**7.2.1 Unit Tests**
- [ ] Calculation services tests
- [ ] Data conversion tests
- [ ] SAT catalog validation tests
- [ ] CFDI mapper tests

**7.2.2 Integration Tests**
- [ ] Complete flow test: calculation → save → query
- [ ] Data migration test
- [ ] CFDI creation test (Facturama sandbox)
- [ ] Stamp → Cancel workflow test

**7.2.3 E2E Tests**
- [ ] Create payroll from scratch
- [ ] Query existing payroll
- [ ] Generate and stamp CFDI
- [ ] Cancel CFDI
- [ ] Download PDF/XML

### 7.3 Documentation

- [ ] Update CLAUDE.md with new schema
- [ ] Document API endpoints (Swagger/OpenAPI)
- [ ] Create migration guide for dev team
- [ ] Document SAT catalogs used
- [ ] Document Facturama integration

### 7.4 Production Validation

- [ ] Deploy to staging
- [ ] Test with real data (don't stamp)
- [ ] QA review
- [ ] Deploy to production
- [ ] Post-deploy monitoring

**Phase 7 Outputs:**
- ✅ Clean code without legacy fields
- ✅ Complete test suite
- ✅ Updated documentation
- ✅ System in production working

---

## Timeline & Dependencies

```
Phase 1 (Analysis) ────┐
                       ▼
Phase 2 (Resources) ───┐
                       ▼
Phase 3 (Schema) ──────┐
                       ▼
Phase 4 (Migration) ───┐
                       ▼
Phase 5 (Refactor) ────┐
                       │
                       ├──── Frontend Updates (parallel)
                       │
                       ▼
Phase 6 (Facturama) ───┐  ⭐ FINAL GOAL
                       │
                       ▼
Phase 7 (Cleanup) ─────┐
                       ▼
                  Production
```

---

## Risks & Mitigations

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|------------|
| Data loss in migration | Medium | High | Dry runs + backups + automatic rollback |
| API changes break frontend | High | High | Transition schema + backward compatibility |
| Incorrect calculations | Medium | High | Exhaustive tests + legacy vs new comparison |
| Outdated SAT catalogs | Low | Medium | Manual validation + periodic updates |
| Performance degradation | Medium | Medium | Proper indexes + CompanySettings cache |
| Facturama API errors | Medium | High | Robust error handling + retry logic + sandbox testing |
| Breaking DDD patterns | Low | Medium | Code reviews + follow existing patterns |

---

## Success Metrics

- ✅ 100% historical payrolls migrated without data loss
- ✅ New payroll calculation generates identical data to legacy (validation)
- ✅ CFDI generated correctly and stamped in Facturama
- ✅ Tooltips work correctly in frontend
- ✅ Performance equal or better than previous system
- ✅ 0 critical bugs in production in first week
- ✅ **Complete workflow: Create → Approve → Stamp → Download working**
- ✅ **DDD principles maintained throughout codebase**

---

## Contacts & Responsibilities

- **Product Owner:** [Name]
- **Tech Lead:** [Name]
- **Backend Dev:** [Name]
- **Frontend Dev:** [Name]
- **QA:** [Name]

---

## Additional Notes

- **Data backup:** Perform complete backup before each migration phase
- **Feature flags:** Consider using feature flags for gradual rollout
- **Monitoring:** Configure alerts to detect production issues
- **Rollback plan:** Have rollback plan for each phase
- **DDD adherence:** Code reviews must verify DDD patterns are followed
- **Facturama sandbox:** All tests must pass in sandbox before production

---

**Last update:** 2026-01-02
**Next review:** After completing Phase 1
