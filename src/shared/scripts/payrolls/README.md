# Payroll Parser Script

This script parses payroll data from an Excel file and generates JSON payroll records compatible with the HVP backend system.

## Usage

```bash
cd src/shared/scripts/payrolls
npx ts-node parsePayrolls.ts
```

## Input

The script reads from `../data/payroll.xlsx` which should have the following structure:

| Date       | Código       | Concepto    | Beneficiario      | Ingreso       | Egreso           |
| ---------- | ------------ | ----------- | ----------------- | ------------- | ---------------- |
| Excel date | Payroll code | Description | Collaborator code | Income amount | Deduction amount |

## Output

Generates `payrollOutput.json` with an array of payroll records structured according to the PayrollEntity interface, using imported types from `domain/value-objects`.

## Features

- ✅ Reads Excel files with automatic date parsing (supports Excel serial dates and Spanish date formats)
- ✅ Maps collaborator codes to full collaborator data
- ✅ Groups payroll data by date and collaborator
- ✅ Calculates half-month periods automatically
- ✅ Maps payroll concept codes to specific earnings/deductions
- ✅ Handles 2172 code variations based on concept descriptions
- ✅ Calculates totals and net pay
- ✅ Generates proper Mexico timezone dates
- ✅ Ensures all earnings are positive values
- ✅ Uses imported types from domain/value-objects

## Concept Code Mappings

| Code       | Description                               | Maps to                              |
| ---------- | ----------------------------------------- | ------------------------------------ |
| 2111, 2174 | Salary                                    | halfWeekFixedIncome                  |
| 2132       | Vacation bonus                            | vacationBonus                        |
| 2133       | Double overtime                           | doubleOvertimeHours                  |
| 2134       | Sunday bonus                              | sundayBonus                          |
| 2136       | Holiday/rest extra pay                    | holidayOrRestExtraPay                |
| 2137       | Year-end bonus                            | endYearBonus                         |
| 2141       | Social security withholding               | socialSecurityWithholding            |
| 2144       | Infonavit withholding                     | otherFixedDeductions                 |
| 2155       | Training support                          | traniningActivitySupport             |
| 2171       | Commissions                               | commissions                          |
| 2172       | Variable compensation (context-dependent) | Multiple fields based on description |
| 2173       | Punctuality bonus                         | punctualityBonus                     |
| 2812       | Income tax withholding                    | incomeTaxWithholding                 |
| 2813       | Employment subsidy                        | employmentSubsidy                    |

## 2172 Code Variations

The script intelligently maps code 2172 based on the concept description:

- **Montejo** → expressBranchCompensation
- **alimentos** → mealCompensation
- **vacaciones** → vacationCompensation
- **faltas** → absencesJustifiedByCompanyCompensation
- **ingreso mínimo** → guaranteedPerceptionCompensation
- **Other** → extraVariableCompensations

## Period Calculation

The script automatically calculates payroll periods based on Mexican half-month system:

- **1st-15th**: First half of month
- **16th-End**: Second half of month

All dates are converted to Mexico/Mexico_City timezone.

## Dependencies

- xlsx: Excel file parsing
- dayjs: Date manipulation with timezone support
- fs: File system operations

## Data Sources

- **Collaborators**: `../data/collaboratorsData.json`
- **Payroll Excel**: `../data/payroll.xlsx`
