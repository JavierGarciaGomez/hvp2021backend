# Year-End Bonus (Aguinaldo) Calculation Rules

## Business Decisions - Approved Rules

### 1. Commission Inclusion
**Rule:** Include 50% of total commissions in the calculation base

**Implementation:**
```typescript
const yearCommissions = sumAllCommissionsForYear(collaboratorId, year);
const commissionBase = yearCommissions * 0.5;
```

**Minimum Salary Floor:**
- If the calculated base is lower than minimum wage, use minimum wage instead
- Compare against: Current minimum wage

---

### 2. Absences and Attendance Deductions
**Rule:** Deduct ALL attendance-related discounts from the calculation base

**What to deduct:**
- ✅ Unworked hours (`unworkedHoursDiscount`)
- ✅ Tardiness (`tardinessDiscount`)
- ✅ Justified absences (`justifiedAbsencesDiscount`)
- ✅ Unjustified absences (`unjustifiedAbsencesDiscount`)
- ✅ Non-counted days (`nonCountedDaysDiscount`)

**What NOT to deduct:**
- ❌ Income tax (`incomeTaxWithholding`)
- ❌ Social security (`socialSecurityWithholding`)
- ❌ Other fixed/variable deductions

**Formula:**
```typescript
const totalAttendanceDeductions =
  unworkedHoursDiscount +
  tardinessDiscount +
  justifiedAbsencesDiscount +
  unjustifiedAbsencesDiscount +
  nonCountedDaysDiscount;
```

---

### 3. Calculation Base - Selective Approach
**Rule:** Calculate based on SPECIFIC earnings minus attendance deductions

**What to INCLUDE in earnings:**
- ✅ Base salary (`halfWeekFixedIncome`)
- ✅ Additional fixed incomes (`additionalFixedIncomes`)
- ✅ Commissions - 50% only (`commissions * 0.5`)

**What NOT to include:**
- ❌ Training support
- ❌ Physical activity support
- ❌ Reception bonus
- ❌ Punctuality bonus
- ❌ Express branch compensation
- ❌ Overtime (simple, double, triple)
- ❌ Sunday bonus
- ❌ Holiday/rest extra pay
- ❌ Vacation compensation
- ❌ Vacation bonus
- ❌ Special bonuses
- ❌ Extra variable compensations
- ❌ Guaranteed income compensation
- ❌ Employment subsidy
- ❌ Year-end bonus itself (avoid circular reference)

**Formula:**
```typescript
// For each payroll in the year
const includedEarnings =
  payroll.earnings.halfWeekFixedIncome +
  sumArray(payroll.earnings.additionalFixedIncomes) +
  (payroll.earnings.commissions * 0.5);

const attendanceDeductions =
  payroll.deductions.nonCountedDaysDiscount +
  payroll.deductions.justifiedAbsencesDiscount +
  payroll.deductions.unjustifiedAbsencesDiscount +
  payroll.deductions.unworkedHoursDiscount +
  payroll.deductions.tardinessDiscount;

const netEarnings = includedEarnings - attendanceDeductions;

// Sum across all payrolls in the year
const yearlyNetEarnings = sumAcrossAllPayrolls(year);
```

---

### 4. Advances
**Rule:** No advances are given

**Implementation:**
- No need to track advances
- Year-end bonus is paid once per year in December
- Simpler implementation

---

### 5. Calculation Period Dates
**Rule:** Fixed dates based on hire date and year

**End Date:**
- Always December 31st of the current year
- `const endDate = new Date(currentYear, 11, 31);`

**Start Date:**
- If hired BEFORE January 1st of current year → January 1st
- If hired AFTER January 1st of current year → Hire date

```typescript
const yearStart = new Date(currentYear, 0, 1);
const hireDate = new Date(employment.hireDate);
const startDate = hireDate > yearStart ? hireDate : yearStart;
```

**Days worked:**
```typescript
const daysWorked = daysBetween(startDate, endDate) + 1; // +1 to include both dates
```

---

## Complete Calculation Formula

### Approach: Sum of All Paid Earnings

```typescript
async function calculateYearEndBonus(
  collaboratorId: string,
  year: number
): Promise<number> {
  // Step 1: Get all payrolls for the year
  const yearPayrolls = await getCollaboratorPayrollsForYear(collaboratorId, year);

  // Step 2: Calculate net earnings across all payrolls
  let totalNetEarnings = 0;

  for (const payroll of yearPayrolls) {
    // Sum ONLY the specific earnings to include
    const earnings =
      payroll.earnings.halfWeekFixedIncome +
      sumArray(payroll.earnings.additionalFixedIncomes) +
      (payroll.earnings.commissions * 0.5); // Only 50% of commissions

    // Sum attendance-related deductions
    const attendanceDeductions =
      payroll.deductions.nonCountedDaysDiscount +
      payroll.deductions.justifiedAbsencesDiscount +
      payroll.deductions.unjustifiedAbsencesDiscount +
      payroll.deductions.unworkedHoursDiscount +
      payroll.deductions.tardinessDiscount;

    // Net earnings for this payroll
    totalNetEarnings += (earnings - attendanceDeductions);
  }

  // Step 3: Calculate daily salary
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year, 11, 31);
  const hireDate = new Date(employment.hireDate);
  const startDate = hireDate > yearStart ? hireDate : yearStart;
  const daysWorked = daysBetween(startDate, yearEnd) + 1;

  const dailySalary = totalNetEarnings / daysWorked;

  // Step 4: Apply minimum wage floor
  const minimumDailyWage = getMinimumDailyWage(year);
  const effectiveDailySalary = Math.max(dailySalary, minimumDailyWage);

  // Step 5: Calculate year-end bonus
  const YEAR_END_BONUS_DAYS = 15;
  const proportionalDays = (daysWorked / 365) * YEAR_END_BONUS_DAYS;
  const yearEndBonus = proportionalDays * effectiveDailySalary;

  return yearEndBonus;
}
```

---

## Edge Cases & Validations

### 1. New Hire Mid-Year
**Scenario:** Employee hired on July 1st

**Calculation:**
- Start date: July 1st
- End date: December 31st
- Days worked: 184 days
- Proportional: (184 / 365) * 15 = 7.56 days

---

### 2. No Payrolls in Year
**Scenario:** Employee hired in December but no payrolls generated yet

**Solution:**
- If no payrolls exist, calculate based on current employment data
- Use base salary only (no commissions, no bonuses)
- Apply proportional calculation from hire date to Dec 31

---

### 3. Minimum Wage Floor
**Scenario:** Part-time employee or many absences, daily salary below minimum

**Solution:**
- Calculate: `dailySalary = totalNetEarnings / daysWorked`
- Compare: `if (dailySalary < minimumDailyWage)`
- Use: `effectiveDailySalary = minimumDailyWage`

---

### 4. Commissions
**Scenario:** Employee with variable commissions

**Implementation:**
- Sum all commissions from all payrolls in the year
- Multiply by 0.5 (50%)
- Include in total earnings

---

### 5. Employee Terminated Mid-Year
**Scenario:** Employee left the company in August

**Calculation:**
- Start date: Jan 1st (or hire date if later)
- End date: Termination date (NOT Dec 31)
- Days worked: From start to termination
- Proportional calculation applies

**Note:** This would need a parameter to specify end date if not Dec 31

---

## Summary of Constants

```typescript
export const YEAR_END_BONUS_DAYS = 15; // Already exists in constants
export const COMMISSION_PERCENTAGE_FOR_YEAR_END_BONUS = 0.5; // New
export const DAYS_IN_YEAR = 365; // For calculation
```

---

## Data Requirements

### What we need to fetch:
1. All payrolls for the collaborator in the specified year
2. Employment data (hire date)
3. Current minimum wage (UMA or salario mínimo) for the year
4. If no payrolls exist, current employment salary data

### Repositories/Services needed:
- `PayrollRepository.findByCollaboratorAndYear(collaboratorId, year)`
- `SalaryDataService.getMinimumDailyWage(year)`
- `EmploymentService.findByCollaboratorId(collaboratorId)`

---

## Implementation Notes

### Performance Considerations:
- Fetching all payrolls for a year could be many records (26 payrolls if bi-weekly)
- Consider caching or aggregation queries
- Could pre-calculate totals when payrolls are created

### Accuracy:
- All calculations should maintain precision (use proper decimal handling)
- Round final result to 2 decimal places

### Audit Trail:
- Consider storing calculation breakdown for transparency
- Store: base earnings, deductions, daily salary, proportional days, final amount