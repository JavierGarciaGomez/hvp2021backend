# Facturama Payroll Integration Research

## Overview
This document analyzes the mapping between our current payroll system and Facturama's API requirements for generating Mexican payroll CFDI (Comprobante Fiscal Digital por Internet).

## Table of Contents
1. [Earnings (Perceptions) Mapping](#earnings-perceptions-mapping)
2. [Deductions Mapping](#deductions-mapping)
3. [Totals Mapping](#totals-mapping)
4. [Other Payments Mapping](#other-payments-mapping)
5. [General Data Mapping](#general-data-mapping)
6. [Implementation Recommendations](#implementation-recommendations)

---

## Earnings (Perceptions) Mapping

### Current System: PayrollEarnings

| Our Field | Type | Facturama Code | Facturama Name | Notes |
|-----------|------|----------------|----------------|-------|
| `halfWeekFixedIncome` | number | 001 | Sueldos, Salarios Rayas y Jornales | Base salary for half-week period. Split into TaxedAmount/ExemptAmount |
| `halfWeekHourlyPay` | number | 001 | Sueldos, Salarios Rayas y Jornales | Hourly wages. Split into TaxedAmount/ExemptAmount |
| `additionalFixedIncomes[]` | PayrollConcept[] | 038 | Otros ingresos por salarios | Map each concept individually |
| `commissions` | number | 028 | Comisiones | Must be Gravado (Taxed) |
| `punctualityBonus` | number | 010 | Premios por puntualidad | Gravado (Taxed) |
| `receptionBonus` | number | 038 | Otros ingresos por salarios | Custom bonus - use generic code |
| `expressBranchCompensation` | number | 038 | Otros ingresos por salarios | Custom compensation |
| `vacationCompensation` | number | 038 | Otros ingresos por salarios | Payment for unused vacation days |
| `specialBonuses[]` | PayrollConcept[] | 038 | Otros ingresos por salarios | Map each bonus individually |
| `guaranteedIncomeCompensation` | number | 038 | Otros ingresos por salarios | Salary guarantee compensation |
| `simpleOvertimeHours` | number | 019 | Horas extra | Calculate amount, split Exento/Gravado per SAT rules |
| `doubleOvertimeHours` | number | 019 | Horas extra | Double rate overtime, split Exento/Gravado |
| `tripleOvertimeHours` | number | 019 | Horas extra | Triple rate overtime, split Exento/Gravado |
| `sundayBonus` | number | 020 | Prima dominical | Split Exento/Gravado per regulations |
| `holidayOrRestExtraPay` | number | 019 | Horas extra | Extra pay for holidays/rest days |
| `endYearBonus` | number | 002 | Gratificación Anual (Aguinaldo) | Split Exento/Gravado per regulations |
| `vacationBonus` | number | 021 | Prima vacacional | Split Exento/Gravado per regulations |
| `profitSharing` | number | 003 | Participación de los Trabajadores en las Utilidades PTU | Split Exento/Gravado |
| `employmentSubsidy` | number | N/A | N/A | Goes in OtherPayments, not Perceptions |
| `traniningActivitySupport` | number | 038 | Otros ingresos por salarios | Training support payment |
| `physicalActivitySupport` | number | 038 | Otros ingresos por salarios | Physical activity support |
| `extraVariableCompensations[]` | PayrollConcept[] | 038 | Otros ingresos por salarios | Map each compensation |
| `absencesJustifiedByCompanyCompensation` | number | 038 | Otros ingresos por salarios | Legacy field |
| `mealCompensation` | number | 047 | Alimentación | Split Exento/Gravado |

### Key Notes on Perceptions:
- **TaxedAmount vs ExemptAmount**: Most perceptions must be split according to Mexican tax law:
  - Overtime: First 9 hours/week exempt, rest taxed
  - Sunday bonus: 1 UMA exempt per day, rest taxed
  - Vacation bonus: 15 UMA exempt annually, rest taxed
  - End year bonus: 30 UMA exempt annually, rest taxed
  - Meal allowances: Specific rules apply
- **Code field**: Use internal control codes (3-15 chars), not necessarily SAT codes
- **Description**: Should align conceptually but doesn't need exact catalog match

---

## Deductions Mapping

### Current System: PayrollDeductions

| Our Field | Type | Facturama Code | Facturama Name | Notes |
|-----------|------|----------------|----------------|-------|
| `incomeTaxWithholding` | number | 002 | ISR | Income tax withholding |
| `socialSecurityWithholding` | number | 001 | Seguridad social | IMSS employee contribution |
| `otherFixedDeductions[]` | PayrollConcept[] | Various | Various | Map based on concept type |
| `otherVariableDeductions[]` | PayrollConcept[] | Various | Various | Map based on concept type |
| `nonCountedDaysDiscount` | number | 020 | Ausencia (Ausentismo) | Days not worked deduction |
| `justifiedAbsencesDiscount` | number | 020 | Ausencia (Ausentismo) | Justified absences discount |
| `unjustifiedAbsencesDiscount` | number | 020 | Ausencia (Ausentismo) | Unjustified absences discount |
| `unworkedHoursDiscount` | number | 020 | Ausencia (Ausentismo) | Unworked hours discount |
| `tardinessDiscount` | number | 020 | Ausencia (Ausentismo) | Lateness penalty |

### Common Deduction Codes Reference:

| Code | Name | Common Usage |
|------|------|--------------|
| 001 | Seguridad social | IMSS employee portion |
| 002 | ISR | Income tax withholding |
| 003 | Aportaciones a retiro, cesantía en edad avanzada y vejez | Retirement contributions |
| 004 | Otros | Other deductions |
| 005 | Aportaciones a Fondo de vivienda | Housing fund (INFONAVIT) |
| 006 | Descuento por incapacidad | Disability discount |
| 007 | Pensión alimenticia | Child support |
| 010 | Pago por crédito de vivienda | Housing credit payment |
| 011 | Pago de abonos INFONACOT | INFONACOT loan payments |
| 012 | Anticipo de salarios | Salary advance |
| 019 | Cuotas sindicales | Union dues |
| 020 | Ausencia (Ausentismo) | Absences |

### Key Notes on Deductions:
- All amounts must be positive (>0)
- Description should align conceptually with SAT catalog
- Code is internal control (3-15 chars)

---

## Totals Mapping

### Current System: PayrollTotals

| Our Field | Facturama Field | Calculation | Notes |
|-----------|-----------------|-------------|-------|
| `totalIncome` | `Perceptions.TotalGravado + Perceptions.TotalExento` | Sum of all TaxedAmount + ExemptAmount | Must match sum of all perceptions |
| `totalDeductions` | `Deductions.TotalOtrasDeducciones + Deductions.TotalImpuestosRetenidos` | Sum of all deduction amounts | Facturama calculates automatically |
| `netPay` | Not directly mapped | totalIncome - totalDeductions + otherPayments | Calculate locally before sending |

### Facturama Auto-calculated Totals:
- `Perceptions.TotalSueldos`: Sum of perception type 001
- `Perceptions.TotalGravado`: Sum of all TaxedAmount
- `Perceptions.TotalExento`: Sum of all ExemptAmount
- `Deductions.TotalOtrasDeducciones`: Sum of deductions excluding ISR
- `Deductions.TotalImpuestosRetenidos`: ISR deduction amount

---

## Other Payments Mapping

These are payments that don't count as taxable income or standard deductions:

| Our Field | Facturama Code | Facturama Name | Notes |
|-----------|----------------|----------------|-------|
| `employmentSubsidy` | 002 | Subsidio para el empleo (efectivamente entregado al trabajador) | Employment subsidy given to worker |
| N/A | 001 | Reintegro de ISR pagado en exceso | ISR refund if overpaid |
| N/A | 003 | Viáticos (entregados al trabajador) | Travel expenses given to worker |
| N/A | 004 | Aplicación de saldo a favor por compensación anual | Annual compensation credit |

### Key Notes on Other Payments:
- Use EmploymentSubsidy nested object when applicable
- Most scenarios will use code 002 for employment subsidy
- These don't count toward TotalGravado/TotalExento

---

## General Data Mapping

### Current System: PayrollGeneralData → Facturama Employee

| Our Field | Facturama Field | Required | Notes |
|-----------|-----------------|----------|-------|
| `fullName` | `Receiver.Name` | Yes | Full legal name |
| `collaboratorCode` | `Employee.EmployeeNumber` | Yes | Internal employee ID (1-15 chars) |
| `curp` | `Employee.Curp` | Yes | 18-character CURP |
| `socialSecurityNumber` | `Employee.SocialSecurityNumber` | Yes | IMSS number |
| `rfcNumber` | `Receiver.Rfc` | Yes | Tax registration ID |
| `jobTitle` | `Employee.Position` | Yes | Job position/title |
| `paymentType` | `Employee.FrequencyPayment` | Yes | Map to SAT frequency codes |
| `contributionBaseSalary` | `Employee.BaseSalary` & `Employee.DailySalary` | Yes | Contribution base salary |

### Additional Required Fields Not in Our System:

| Facturama Field | Required | Notes | Recommendation |
|-----------------|----------|-------|----------------|
| `ExpeditionPlace` | Yes | Company branch postal code | Add to company/branch settings |
| `Issuer.EmployerRegistration` | Yes | Employer registration (1-20 chars) | Add to company settings |
| `Employee.StartDateLaborRelations` | Yes | Employment start date | Add to employment entity |
| `Employee.ContractType` | Yes | SAT catalog code | Add to employment entity |
| `Employee.RegimeType` | Yes | "02" for salaries | Can be constant |
| `Employee.Unionized` | Yes | Boolean | Add to employee entity |
| `Employee.TypeOfJourney` | Yes | SAT catalog code | Add to employment entity |
| `Employee.Department` | No | Department name | Optional, from job entity |
| `Employee.PositionRisk` | Yes | "1" or "99" | Add to job entity |
| `Employee.Bank` | No | Bank name | Add to employee entity |
| `Employee.BankAccount` | No | Account number/CLABE | Add to employee entity |
| `Employee.FederalEntityKey` | Yes | State code where work is done | Add to job/branch entity |
| `Receiver.CfdiUse` | Yes | Always "CN01" for payroll | Can be constant |
| `Receiver.FiscalRegime` | Yes | Usually "605" for employees | Add to employee entity |
| `Receiver.TaxZipCode` | Yes | Employee's tax zip code | Add to employee entity |

---

## Implementation Recommendations

### 1. Database Schema Changes

Add the following fields to existing entities:

**Company/Branch Entity:**
- `expeditionPlace`: string (postal code)
- `employerRegistration`: string (1-20 chars)

**Employee Entity:**
- `fiscalRegime`: string (SAT code, default "605")
- `taxZipCode`: string
- `bankName`: string (optional)
- `bankAccount`: string (optional)
- `unionized`: boolean (default false)

**Employment Entity:**
- `startDateLaborRelations`: Date
- `contractType`: string (SAT code)
- `typeOfJourney`: string (SAT code)
- `federalEntityKey`: string (state code)

**Job Entity:**
- `positionRisk`: string ("1" or "99")
- `department`: string (optional)

### 2. Tax Calculation Service

Create a service to split amounts into TaxedAmount/ExemptAmount:

```typescript
interface TaxSplitResult {
  taxedAmount: number;
  exemptAmount: number;
}

class PayrollTaxCalculator {
  // Calculate exempt amounts based on UMA and regulations
  splitOvertimeHours(amount: number, hours: number): TaxSplitResult
  splitSundayBonus(amount: number): TaxSplitResult
  splitVacationBonus(amount: number, annualTotal: number): TaxSplitResult
  splitEndYearBonus(amount: number, annualTotal: number): TaxSplitResult
  splitMealCompensation(amount: number): TaxSplitResult
  // ... other split methods
}
```

### 3. Facturama Mapper Service

Create a transformation service:

```typescript
interface FacturamaPayrollRequest {
  NameId: number;
  ExpeditionPlace: string;
  CfdiType: string;
  PaymentMethod: string;
  Folio?: number;
  Receiver: FacturamaReceiver;
  Complemento: {
    Payroll: FacturamaPayroll;
  };
}

class FacturamaPayrollMapper {
  mapPayrollEntity(
    payroll: PayrollEntity,
    employee: EmployeeEntity,
    employment: EmploymentEntity,
    company: CompanyEntity
  ): FacturamaPayrollRequest
}
```

### 4. Perception Type Mapping Configuration

Create a configuration file for mapping:

```typescript
const PERCEPTION_MAPPING = {
  halfWeekFixedIncome: { code: '001', name: 'Sueldos, Salarios Rayas y Jornales' },
  commissions: { code: '028', name: 'Comisiones' },
  punctualityBonus: { code: '010', name: 'Premios por puntualidad' },
  simpleOvertimeHours: { code: '019', name: 'Horas extra' },
  sundayBonus: { code: '020', name: 'Prima dominical' },
  endYearBonus: { code: '002', name: 'Gratificación Anual (Aguinaldo)' },
  vacationBonus: { code: '021', name: 'Prima vacacional' },
  profitSharing: { code: '003', name: 'PTU' },
  mealCompensation: { code: '047', name: 'Alimentación' },
  // ... rest of mappings
};

const DEDUCTION_MAPPING = {
  incomeTaxWithholding: { code: '002', name: 'ISR' },
  socialSecurityWithholding: { code: '001', name: 'Seguridad social' },
  nonCountedDaysDiscount: { code: '020', name: 'Ausencia (Ausentismo)' },
  // ... rest of mappings
};
```

### 5. Validation Layer

Before sending to Facturama:

- Verify all required fields are present
- Validate CURP format (18 chars)
- Validate RFC format
- Ensure TotalGravado + TotalExento = sum of all perceptions
- Validate all amounts are positive
- Check date ranges are logical

### 6. Testing Strategy

1. **Sandbox Testing**: Use Facturama sandbox environment
2. **Test Cases**:
   - Simple salary only
   - Salary + overtime
   - Salary + bonuses
   - Salary with all possible deductions
   - Edge cases (zero amounts, maximum exempt amounts)
3. **Validation**: Compare generated XML against SAT validation tool

### 7. Error Handling

Common errors to handle:
- Invalid CURP/RFC format
- Incorrect perception/deduction codes
- Amount validation failures
- Missing required employee data
- Date range issues

### 8. Migration Considerations

For existing payrolls:
- Backfill missing employee data (CURP, RFC, etc.)
- Add default values for new required fields
- Create data validation scripts
- Plan for gradual rollout

---

## API Integration Endpoints

### Facturama Sandbox Base URL
```
https://apisandbox.facturama.mx
```

### Authentication
```
Basic Authentication: hvetsandbox2:hvetsandbox2
Base64: aHZldHNhbmRib3gyOmh2ZXRzYW5kYm94Mg==
```

### Key Endpoints

**Create Payroll CFDI:**
```
POST /api/3/cfdis
Content-Type: application/json
Authorization: Basic aHZldHNhbmRib3gyOmh2ZXRzYW5kYm94Mg==

Body: FacturamaPayrollRequest
```

**Get Catalogs:**
```
GET /catalogs/perceptions
GET /catalogs/deductions
GET /catalogs/OtherPayments
GET /catalogs/PaymentForms
GET /catalogs/PaymentMethods
```

---

## Critical Rules from SAT

1. **DaysPaid**: Must be > 0, can be fractional (e.g., 5.5 days)

2. **Overtime Exempt Limit**: First 9 overtime hours per week are exempt from ISR

3. **Sunday Bonus Exempt**: 1 UMA per working Sunday is exempt

4. **Vacation Bonus Exempt**: Up to 15 UMA annually is exempt

5. **End Year Bonus (Aguinaldo) Exempt**: Up to 30 UMA annually is exempt

6. **Total Validation**:
   ```
   TotalSueldos + TotalSeparacionIndemnizacion + TotalJubilacionPensionRetiro
   = TotalGravado + TotalExento
   ```

7. **Employee Number**: 1-15 characters, alphanumeric

8. **CfdiUse for Employees**: Use "CN01" (Nómina)

9. **PaymentMethod**:
   - "PUE" = Pago en una sola exhibición (single payment)
   - "PPD" = Pago en parcialidades o diferido (installments)

10. **Folio**: Optional internal consecutive number

---

## UMA (Unidad de Medida y Actualización) Reference

Current UMA value (2024): $108.57 MXN per day

Used for calculating exempt amounts:
- 9 overtime hours: ~9 UMA
- 15 UMA vacation bonus exemption
- 30 UMA aguinaldo exemption
- 1 UMA per Sunday worked

**Note**: UMA value changes annually, must be updated in system.

---

## Next Steps

1. Review and approve database schema changes
2. Implement tax calculation service with UMA-based exempt calculations
3. Create Facturama mapper service
4. Set up sandbox testing environment
5. Implement validation layer
6. Create migration scripts for existing data
7. Develop comprehensive test suite
8. Plan production rollout strategy

---

## References

- Facturama API Documentation: https://apisandbox.facturama.mx/guias/nominas/sueldo
- SAT Payroll CFDI Guide: http://www.sat.gob.mx/informacion_fiscal/factura_electronica/
- UMA Official Values: https://www.inegi.org.mx/temas/uma/

---

## Document Version

- **Version**: 1.0
- **Date**: 2025-11-25
- **Author**: Research for Facturama Integration
- **Status**: Initial Research Complete