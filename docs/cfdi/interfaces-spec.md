# TypeScript Interfaces - CFDI/Facturama Migration

**Date:** 20260102
**Purpose:** Define all TypeScript interfaces for new Value Objects, Entities, and DTOs

---

## Table of Contents

1. [Value Objects](#value-objects)
2. [Entities](#entities)
3. [DTOs](#dtos)
4. [SAT Catalogs](#sat-catalogs)
5. [Facturama API](#facturama-api)
6. [Enums](#enums)

---

## Value Objects

### PayrollCfdiData

**Purpose:** Immutable snapshot of employee, employment, and company data at payroll calculation time

```typescript
// domain/value-objects/payroll-cfdi-data.vo.ts

export interface PayrollCfdiDataProps {
  employee: PayrollCfdiEmployee;
  employment: PayrollCfdiEmployment;
  company: PayrollCfdiCompany;
  period: PayrollCfdiPeriod;
}

export interface PayrollCfdiEmployee {
  fullName: string;
  rfc: string;
  curp: string;
  nss: string;
  employeeNumber: string;
  fiscalRegime: string;        // "605" - Sueldos y salarios
  taxZipCode: string;

  // Labor relationship
  startDateLaborRelations: Date;
  contractType: string;        // "01" Permanente, "02" Temporal
  regimeType: string;          // "02" Sueldos y salarios

  // Banking
  bank: string;
  bankAccount: string;
}

export interface PayrollCfdiEmployment {
  jobTitle: string;
  journeyType: string;         // "01" Diurna, "02" Nocturna
  paymentFrequency: string;    // "04" Quincenal
  baseSalary: number;
  dailySalary: number;
  paymentType: string;         // HRPaymentType enum
}

export interface PayrollCfdiCompany {
  name: string;
  rfc: string;
  employerRegistration: string; // Registro patronal IMSS
  expeditionZipCode: string;
  federalEntityKey: string;    // "YUC"
}

export interface PayrollCfdiPeriod {
  startDate: Date;
  endDate: Date;
  paymentDate: Date;
  daysPaid: number;
}

export class PayrollCfdiData {
  readonly employee: PayrollCfdiEmployee;
  readonly employment: PayrollCfdiEmployment;
  readonly company: PayrollCfdiCompany;
  readonly period: PayrollCfdiPeriod;

  constructor(props: PayrollCfdiDataProps) {
    this.employee = props.employee;
    this.employment = props.employment;
    this.company = props.company;
    this.period = props.period;

    // Ensure immutability
    Object.freeze(this.employee);
    Object.freeze(this.employment);
    Object.freeze(this.company);
    Object.freeze(this.period);
    Object.freeze(this);
  }
}
```

---

### PayrollPerception

**Purpose:** Perception (income) with SAT codes and calculation metadata for tooltips

```typescript
// domain/value-objects/payroll-perception.vo.ts

export interface PayrollPerceptionProps {
  perceptionType: string;      // SAT code: "001", "002", etc.
  code: string;                // Internal code: "SALARY", "AGUINALDO"
  description: string;         // "Salario Diario Integrado"
  taxedAmount: number;
  exemptAmount: number;
  totalAmount: number;
  calculation: CalculationMetadata;
  isExtraordinary?: boolean;
  relatedConcept?: string;     // Legacy concept reference
}

export class PayrollPerception {
  readonly perceptionType: string;
  readonly code: string;
  readonly description: string;
  readonly taxedAmount: number;
  readonly exemptAmount: number;
  readonly totalAmount: number;
  readonly calculation: CalculationMetadata;
  readonly isExtraordinary?: boolean;
  readonly relatedConcept?: string;

  constructor(props: PayrollPerceptionProps) {
    // Validate invariants
    if (props.totalAmount !== props.taxedAmount + props.exemptAmount) {
      throw new Error('PayrollPerception: Total must equal taxed + exempt');
    }

    if (props.taxedAmount < 0 || props.exemptAmount < 0) {
      throw new Error('PayrollPerception: Amounts cannot be negative');
    }

    this.perceptionType = props.perceptionType;
    this.code = props.code;
    this.description = props.description;
    this.taxedAmount = props.taxedAmount;
    this.exemptAmount = props.exemptAmount;
    this.totalAmount = props.totalAmount;
    this.calculation = props.calculation;
    this.isExtraordinary = props.isExtraordinary;
    this.relatedConcept = props.relatedConcept;

    Object.freeze(this);
  }
}
```

---

### PayrollDeduction

**Purpose:** Deduction with SAT codes and calculation metadata

```typescript
// domain/value-objects/payroll-deduction.vo.ts

export interface PayrollDeductionProps {
  deductionType: string;       // SAT code: "001" IMSS, "002" ISR
  code: string;                // Internal: "IMSS", "ISR"
  description: string;
  amount: number;
  calculation: CalculationMetadata;
  relatedConcept?: string;
}

export class PayrollDeduction {
  readonly deductionType: string;
  readonly code: string;
  readonly description: string;
  readonly amount: number;
  readonly calculation: CalculationMetadata;
  readonly relatedConcept?: string;

  constructor(props: PayrollDeductionProps) {
    if (props.amount < 0) {
      throw new Error('PayrollDeduction: Amount cannot be negative');
    }

    this.deductionType = props.deductionType;
    this.code = props.code;
    this.description = props.description;
    this.amount = props.amount;
    this.calculation = props.calculation;
    this.relatedConcept = props.relatedConcept;

    Object.freeze(this);
  }
}
```

---

### PayrollOtherPayment

**Purpose:** Other payments (subsidio para el empleo)

```typescript
// domain/value-objects/payroll-other-payment.vo.ts

export interface PayrollOtherPaymentProps {
  otherPaymentType: string;    // SAT: "002" Subsidio para el empleo
  code: string;
  description: string;
  amount: number;
  employmentSubsidy?: {
    amount: number;
  };
}

export class PayrollOtherPayment {
  readonly otherPaymentType: string;
  readonly code: string;
  readonly description: string;
  readonly amount: number;
  readonly employmentSubsidy?: {
    amount: number;
  };

  constructor(props: PayrollOtherPaymentProps) {
    if (props.amount < 0) {
      throw new Error('PayrollOtherPayment: Amount cannot be negative');
    }

    this.otherPaymentType = props.otherPaymentType;
    this.code = props.code;
    this.description = props.description;
    this.amount = props.amount;
    this.employmentSubsidy = props.employmentSubsidy;

    Object.freeze(this);
  }
}
```

---

### CalculationMetadata

**Purpose:** Calculation breakdown for frontend tooltips

```typescript
// domain/value-objects/calculation-metadata.vo.ts

export interface CalculationStep {
  step: number;
  description: string;
  operation: string;           // "1500 * 15 days"
  result: number;
}

export interface CalculationMetadataProps {
  formula?: string;            // "(baseSalary / 365) * 15 days"
  breakdown?: CalculationStep[];
  umaLimit?: number;
  exemptDays?: number;
  taxRate?: number;            // For deductions (ISR %)
  taxBase?: number;            // Base gravable
  notes?: string;
}

export class CalculationMetadata {
  readonly formula?: string;
  readonly breakdown?: CalculationStep[];
  readonly umaLimit?: number;
  readonly exemptDays?: number;
  readonly taxRate?: number;
  readonly taxBase?: number;
  readonly notes?: string;

  constructor(props: CalculationMetadataProps) {
    this.formula = props.formula;
    this.breakdown = props.breakdown;
    this.umaLimit = props.umaLimit;
    this.exemptDays = props.exemptDays;
    this.taxRate = props.taxRate;
    this.taxBase = props.taxBase;
    this.notes = props.notes;

    if (this.breakdown) {
      Object.freeze(this.breakdown);
    }
    Object.freeze(this);
  }
}
```

---

### PayrollCfdiTotals

**Purpose:** CFDI totals (separate from legacy totals)

```typescript
// domain/value-objects/payroll-cfdi-totals.vo.ts

export interface PayrollCfdiTotalsProps {
  totalPerceptions: number;
  totalTaxedPerceptions: number;
  totalExemptPerceptions: number;
  totalDeductions: number;
  totalOtherPayments: number;
  netPay: number;
}

export class PayrollCfdiTotals {
  readonly totalPerceptions: number;
  readonly totalTaxedPerceptions: number;
  readonly totalExemptPerceptions: number;
  readonly totalDeductions: number;
  readonly totalOtherPayments: number;
  readonly netPay: number;

  constructor(props: PayrollCfdiTotalsProps) {
    // Validate invariants
    const expectedTotal = props.totalTaxedPerceptions + props.totalExemptPerceptions;
    if (Math.abs(expectedTotal - props.totalPerceptions) > 0.01) {
      throw new Error('PayrollCfdiTotals: Total perceptions must equal taxed + exempt');
    }

    const expectedNet = props.totalPerceptions - props.totalDeductions + props.totalOtherPayments;
    if (Math.abs(expectedNet - props.netPay) > 0.01) {
      throw new Error('PayrollCfdiTotals: Net pay calculation error');
    }

    this.totalPerceptions = props.totalPerceptions;
    this.totalTaxedPerceptions = props.totalTaxedPerceptions;
    this.totalExemptPerceptions = props.totalExemptPerceptions;
    this.totalDeductions = props.totalDeductions;
    this.totalOtherPayments = props.totalOtherPayments;
    this.netPay = props.netPay;

    Object.freeze(this);
  }
}
```

---

## Entities

### CompanySettingsEntity

**Purpose:** Singleton aggregate for company fiscal data

```typescript
// domain/entities/company-settings.entity.ts

export interface CompanySettingsProps {
  id?: string;
  name: string;
  rfc: string;
  employerRegistration: string;  // Registro patronal IMSS
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: FiscalAddress;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface FiscalAddress {
  street: string;
  exteriorNumber: string;
  interiorNumber?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

export class CompanySettingsEntity {
  id?: string;
  name: string;
  rfc: string;
  employerRegistration: string;
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: FiscalAddress;
  createdAt?: Date;
  updatedAt?: Date;

  constructor(props: CompanySettingsProps) {
    this.id = props.id;
    this.name = props.name;
    this.rfc = props.rfc;
    this.employerRegistration = props.employerRegistration;
    this.expeditionZipCode = props.expeditionZipCode;
    this.federalEntityKey = props.federalEntityKey;
    this.fiscalAddress = props.fiscalAddress;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
  }

  // Validation
  validate(): void {
    if (!this.rfc || this.rfc.length !== 12) {
      throw new Error('CompanySettings: Invalid RFC');
    }
    if (!this.employerRegistration) {
      throw new Error('CompanySettings: Employer registration required');
    }
  }
}
```

---

### CollaboratorEntity (Extensions)

**Purpose:** Extend existing Collaborator with CFDI fields

```typescript
// domain/entities/collaborator.entity.ts

export interface CollaboratorCfdiFields {
  // Identification
  employeeNumber: string;
  curp: string;
  nss: string;                    // Número de Seguro Social

  // Labor relationship
  startDateLaborRelations: Date;
  contractType: string;           // SAT catalog: "01", "02"
  regimeType: string;             // SAT catalog: "02"

  // Fiscal data
  fiscalRegime: string;           // "605" - Sueldos y salarios
  taxZipCode: string;

  // Banking
  bank: string;
  bankAccount: string;
}

// Extend existing CollaboratorEntity interface
export interface CollaboratorEntity extends CollaboratorCfdiFields {
  // ... existing fields ...
  id?: string;
  fullName: string;
  email: string;
  // ... etc
}
```

---

### EmploymentEntity (Extensions)

**Purpose:** Extend existing Employment with CFDI fields

```typescript
// domain/entities/employment.entity.ts

export interface EmploymentCfdiFields {
  journeyType: string;           // SAT catalog: "01" Diurna, "02" Nocturna
  paymentFrequency: string;      // SAT catalog: "04" Quincenal
}

// Extend existing EmploymentEntity interface
export interface EmploymentEntity extends EmploymentCfdiFields {
  // ... existing fields ...
  id?: string;
  collaboratorId: string;
  jobId: string;
  startDate: Date;
  // ... etc
}
```

---

### PayrollEntity (v2 - Transition Schema)

**Purpose:** Extended Payroll with CFDI fields (keeping legacy for migration)

```typescript
// domain/entities/payroll.entity.ts

export interface PayrollEntityProps {
  id?: string;
  collaboratorId: string;
  employmentId: string;
  periodStartDate: Date;
  periodEndDate: Date;
  payrollStatus: PayrollStatus;

  // LEGACY (keep during transition)
  generalData: PayrollGeneralData;
  earnings: PayrollEarnings;
  deductions: PayrollDeductions;
  totals: PayrollTotals;
  contextData: PayrollContextData;

  // NEW CFDI fields
  cfdiData?: PayrollCfdiData;
  perceptions?: PayrollPerception[];
  deductionsCfdi?: PayrollDeduction[];
  otherPayments?: PayrollOtherPayment[];
  cfdiTotals?: PayrollCfdiTotals;

  // CFDI metadata
  payrollType?: 'O' | 'E';       // Ordinaria / Extraordinaria
  folio?: string;
  cfdiUuid?: string;
  cfdiStatus?: CfdiStatus;

  // Audit
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class PayrollEntity {
  // ... implement with all fields from PayrollEntityProps
}
```

---

## DTOs

### CompanySettingsDto

```typescript
// application/dtos/company-settings.dto.ts

export interface CompanySettingsDto {
  id: string;
  name: string;
  rfc: string;
  employerRegistration: string;
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: {
    street: string;
    exteriorNumber: string;
    interiorNumber?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface CreateCompanySettingsDto {
  name: string;
  rfc: string;
  employerRegistration: string;
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: {
    street: string;
    exteriorNumber: string;
    interiorNumber?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}

export interface UpdateCompanySettingsDto {
  name?: string;
  rfc?: string;
  employerRegistration?: string;
  expeditionZipCode?: string;
  federalEntityKey?: string;
  fiscalAddress?: {
    street: string;
    exteriorNumber: string;
    interiorNumber?: string;
    neighborhood: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
}
```

---

### PayrollDto (v2)

```typescript
// application/dtos/payroll.dto.ts

export interface PayrollPerceptionDto {
  perceptionType: string;
  code: string;
  description: string;
  taxedAmount: number;
  exemptAmount: number;
  totalAmount: number;
  calculation: {
    formula?: string;
    breakdown?: {
      step: number;
      description: string;
      operation: string;
      result: number;
    }[];
    umaLimit?: number;
    exemptDays?: number;
    notes?: string;
  };
  isExtraordinary?: boolean;
}

export interface PayrollDeductionDto {
  deductionType: string;
  code: string;
  description: string;
  amount: number;
  calculation: {
    formula?: string;
    breakdown?: {
      step: number;
      description: string;
      operation: string;
      result: number;
    }[];
    taxRate?: number;
    taxBase?: number;
    notes?: string;
  };
}

export interface PayrollOtherPaymentDto {
  otherPaymentType: string;
  code: string;
  description: string;
  amount: number;
  employmentSubsidy?: {
    amount: number;
  };
}

export interface PayrollDto {
  id: string;
  collaboratorId: string;
  employmentId: string;
  periodStartDate: string;
  periodEndDate: string;
  payrollStatus: string;

  // CFDI Data
  cfdiData: {
    employee: {
      fullName: string;
      rfc: string;
      curp: string;
      nss: string;
      employeeNumber: string;
      // ... all employee fields
    };
    employment: {
      jobTitle: string;
      journeyType: string;
      paymentFrequency: string;
      // ... all employment fields
    };
    company: {
      name: string;
      rfc: string;
      employerRegistration: string;
      // ... all company fields
    };
    period: {
      startDate: string;
      endDate: string;
      paymentDate: string;
      daysPaid: number;
    };
  };

  perceptions: PayrollPerceptionDto[];
  deductions: PayrollDeductionDto[];
  otherPayments: PayrollOtherPaymentDto[];

  totals: {
    totalPerceptions: number;
    totalTaxedPerceptions: number;
    totalExemptPerceptions: number;
    totalDeductions: number;
    totalOtherPayments: number;
    netPay: number;
  };

  // CFDI metadata
  payrollType: 'O' | 'E';
  folio?: string;
  cfdiUuid?: string;
  cfdiStatus?: string;

  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}
```

---

## SAT Catalogs

### SAT Catalog Types

```typescript
// domain/value-objects/sat-catalog.vo.ts

export interface SATCatalogItem {
  code: string;
  description: string;
}

export class SATPerceptionType implements SATCatalogItem {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}

export class SATDeductionType implements SATCatalogItem {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}

export class SATContractType implements SATCatalogItem {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}

export class SATRegimeType implements SATCatalogItem {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}

export class SATJourneyType implements SATCatalogItem {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}

export class SATPaymentFrequency implements SATCatalogItem {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}

export class SATOtherPaymentType implements SATCatalogItem {
  constructor(
    public readonly code: string,
    public readonly description: string
  ) {}
}
```

---

### SAT Catalog Constants

```typescript
// domain/constants/sat-catalogs.constants.ts

export const SAT_PERCEPTION_TYPES = {
  SALARY: new SATPerceptionType('001', 'Sueldos, Salarios, Rayas y Jornales'),
  AGUINALDO: new SATPerceptionType('002', 'Gratificación Anual (Aguinaldo)'),
  VACATION_BONUS: new SATPerceptionType('021', 'Prima Vacacional'),
  OVERTIME: new SATPerceptionType('019', 'Horas Extra'),
  SUNDAY_BONUS: new SATPerceptionType('020', 'Prima Dominical'),
  PROFIT_SHARING: new SATPerceptionType('045', 'PTU'),
} as const;

export const SAT_DEDUCTION_TYPES = {
  IMSS: new SATDeductionType('001', 'Seguridad Social'),
  ISR: new SATDeductionType('002', 'ISR'),
  INFONAVIT: new SATDeductionType('004', 'Aportaciones a Retiro, Cesantía y Vejez'),
  LOAN: new SATDeductionType('006', 'Descuento por Incapacidad'),
  ABSENCE: new SATDeductionType('007', 'Pensión Alimenticia'),
} as const;

export const SAT_CONTRACT_TYPES = {
  PERMANENT: new SATContractType('01', 'Contrato de trabajo por tiempo indeterminado'),
  TEMPORARY: new SATContractType('02', 'Contrato de trabajo para obra determinada'),
} as const;

export const SAT_REGIME_TYPES = {
  SALARIES: new SATRegimeType('02', 'Sueldos (Incluye ingresos señalados en la fracción I del artículo 94 de LISR)'),
} as const;

export const SAT_JOURNEY_TYPES = {
  DAY: new SATJourneyType('01', 'Diurna'),
  NIGHT: new SATJourneyType('02', 'Nocturna'),
  MIXED: new SATJourneyType('03', 'Mixta'),
} as const;

export const SAT_PAYMENT_FREQUENCIES = {
  DAILY: new SATPaymentFrequency('01', 'Diario'),
  WEEKLY: new SATPaymentFrequency('02', 'Semanal'),
  BIWEEKLY: new SATPaymentFrequency('04', 'Quincenal'),
  MONTHLY: new SATPaymentFrequency('05', 'Mensual'),
} as const;

export const SAT_OTHER_PAYMENT_TYPES = {
  EMPLOYMENT_SUBSIDY: new SATOtherPaymentType('002', 'Subsidio para el empleo (efectivamente entregado al trabajador)'),
} as const;
```

---

## Facturama API

### Facturama Request/Response Types

```typescript
// infrastructure/external-services/facturama-api.types.ts

export interface FacturamaCfdiRequest {
  NameId: number;
  ExpeditionPlace: string;
  CfdiType: 'N';
  PaymentMethod: 'PUE';
  Folio: string;
  Receiver: FacturamaReceiver;
  Complemento: {
    Payroll: FacturamaPayroll;
  };
}

export interface FacturamaReceiver {
  Rfc: string;
  Name: string;
  CfdiUse: 'CN01';
  FiscalRegime: string;
  TaxZipCode: string;
}

export interface FacturamaPayroll {
  Type: 'O' | 'E';
  PaymentDate: string;
  InitialPaymentDate: string;
  FinalPaymentDate: string;
  DaysPaid: number;
  Issuer: {
    EmployerRegistration: string;
  };
  Employee: FacturamaEmployee;
  Perceptions: {
    Details: FacturamaPerception[];
  };
  Deductions: {
    Details: FacturamaDeduction[];
  };
  OtherPayments: FacturamaOtherPayment[];
}

export interface FacturamaEmployee {
  Curp: string;
  SocialSecurityNumber: string;
  StartDateLaborRelations: string;
  ContractType: string;
  RegimeType: string;
  Unionized: boolean;
  TypeOfJourney: string;
  EmployeeNumber: string;
  Department?: string;
  Position: string;
  PositionRisk: string;
  FrequencyPayment: string;
  Bank: string;
  BankAccount: string;
  BaseSalary: number;
  DailySalary: number;
  FederalEntityKey: string;
}

export interface FacturamaPerception {
  PerceptionType: string;
  Code: string;
  Description: string;
  TaxedAmount: number;
  ExemptAmount: number;
}

export interface FacturamaDeduction {
  DeduccionType: string;
  Code: string;
  Description: string;
  Amount: number;
}

export interface FacturamaOtherPayment {
  OtherPaymentType: string;
  Code: string;
  Description: string;
  Amount: number;
  EmploymentSubsidy?: {
    Amount: number;
  };
}

export interface FacturamaCfdiResponse {
  Id: string;
  Folio: string;
  CfdiPdfUrl: string;
  CfdiXmlUrl: string;
  Complement: {
    TaxStamp: {
      Uuid: string;
      Date: string;
      CfdiSign: string;
      SatCertNumber: string;
      SatSign: string;
    };
  };
}

export interface FacturamaErrorResponse {
  Message: string;
  ModelState?: {
    [key: string]: string[];
  };
}
```

---

## Enums

### CfdiStatus

```typescript
// domain/enums/cfdi-status.enum.ts

export enum CfdiStatus {
  Pending = 'pending',
  Stamped = 'stamped',
  Cancelled = 'cancelled',
  Error = 'error'
}
```

---

### PayrollType

```typescript
// domain/enums/payroll-type.enum.ts

export enum PayrollType {
  Ordinary = 'O',
  Extraordinary = 'E'
}
```

---

### JourneyType

```typescript
// domain/enums/journey-type.enum.ts

export enum JourneyType {
  Day = '01',
  Night = '02',
  Mixed = '03'
}
```

---

### PaymentFrequency

```typescript
// domain/enums/payment-frequency.enum.ts

export enum PaymentFrequency {
  Daily = '01',
  Weekly = '02',
  Biweekly = '04',
  Monthly = '05'
}
```

---

### ContractType

```typescript
// domain/enums/contract-type.enum.ts

export enum ContractType {
  Permanent = '01',
  Temporary = '02',
  Training = '03',
  SeasonOrCycle = '04'
}
```

---

### RegimeType

```typescript
// domain/enums/regime-type.enum.ts

export enum RegimeType {
  Salaries = '02',
  Fees = '03',
  Assimilated = '09'
}
```

---

## Repository Interfaces

### CompanySettingsRepository

```typescript
// domain/repositories/company-settings.repository.interface.ts

export interface ICompanySettingsRepository {
  /**
   * Get singleton company settings
   */
  get(): Promise<CompanySettingsEntity>;

  /**
   * Update company settings
   */
  update(settings: CompanySettingsEntity): Promise<void>;

  /**
   * Create initial company settings (for seed)
   */
  create(settings: CompanySettingsEntity): Promise<CompanySettingsEntity>;
}
```

---

## Service Interfaces

### SATCatalogService

```typescript
// domain/services/sat-catalog.service.interface.ts

export interface ISATCatalogService {
  getPerceptionType(code: string): SATPerceptionType | null;
  getDeductionType(code: string): SATDeductionType | null;
  getContractType(code: string): SATContractType | null;
  getRegimeType(code: string): SATRegimeType | null;
  getJourneyType(code: string): SATJourneyType | null;
  getPaymentFrequency(code: string): SATPaymentFrequency | null;
  getOtherPaymentType(code: string): SATOtherPaymentType | null;

  validatePerceptionType(code: string): boolean;
  validateDeductionType(code: string): boolean;
  validateContractType(code: string): boolean;
  validateRegimeType(code: string): boolean;
  validateJourneyType(code: string): boolean;
  validatePaymentFrequency(code: string): boolean;
  validateOtherPaymentType(code: string): boolean;
}
```

---

## Notes

- All Value Objects are **immutable** (Object.freeze)
- All Value Objects validate **invariants** in constructor
- Enums use SAT catalog codes
- DTOs are for API layer, not domain layer
- Repository interfaces define contracts (implementation in infrastructure layer)

---

**Last updated:** 20260102
