# Year-End Bonus Implementation Plan

## Overview
Implement year-end bonus (aguinaldo) calculation with flag `calculateYearEndBonus` query parameter.

---

## Phase 0: Preparation & Setup

### Step 0.1: Create Test Fixtures
**File:** `src/shared/fixtures/year-end-bonus.fixtures.ts`

**Purpose:** Create realistic test data to validate calculations

**Fixtures to create:**
1. **Case 1: Full Year Employee (no absences)**
   - Hire date: 2024-01-01 (before current year)
   - 24 payrolls in 2025
   - Base salary: $10,000/month
   - Commissions: $2,000/year total
   - No attendance deductions
   - Expected aguinaldo: ~$5,100

2. **Case 2: Mid-Year New Hire**
   - Hire date: 2025-07-01
   - 12 payrolls (Jul-Dec)
   - Base salary: $10,000/month
   - Expected aguinaldo: ~$2,550 (proportional)

3. **Case 3: Employee with Absences**
   - Hire date: 2024-01-01
   - 24 payrolls
   - Base salary: $10,000/month
   - Attendance deductions: $1,500 total
   - Expected aguinaldo: lower due to deductions

**Validation:** Fixtures file compiles without errors

---

### Step 0.2: Add Constants
**File:** `src/shared/constants/hris.constants.ts`

**Add:**
```typescript
export const COMMISSION_PERCENTAGE_FOR_YEAR_END_BONUS = 0.5;
```

**Validation:**
- Constant is exported correctly
- Run: `npm run build` - should succeed

---

## Phase 1: Core Calculation Function (Isolated)

### Step 1.1: Create Helper - Calculate Days Between
**File:** `src/application/services/payroll.service.ts`

**Add private method:**
```typescript
private calculateDaysBetween(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
```

**Test manually:**
```typescript
// In a test file or console
const start = new Date('2025-01-01');
const end = new Date('2025-12-31');
// Should return 364
```

**Validation:** Method compiles, no errors

---

### Step 1.2: Create Helper - Sum Array of PayrollConcepts
**File:** `src/application/services/payroll.service.ts`

**Add private method:**
```typescript
private sumPayrollConcepts(concepts: PayrollConcept[]): number {
  if (!concepts || concepts.length === 0) return 0;
  return concepts.reduce((sum, concept) => sum + concept.amount, 0);
}
```

**Validation:** Method compiles

---

### Step 1.3: Create Core Calculation Method
**File:** `src/application/services/payroll.service.ts`

**Add private method:**
```typescript
private async calculateYearEndBonus(
  collaboratorId: string,
  calculationYear: number,
  hireDate: Date
): Promise<number> {
  // Step 1: Get all payrolls for the year
  const yearPayrolls = await this.repository.find({
    collaboratorId,
    periodEndDate: {
      $gte: new Date(calculationYear, 0, 1),
      $lte: new Date(calculationYear, 11, 31)
    }
  });

  // If no payrolls, return 0 (employee didn't work)
  if (!yearPayrolls || yearPayrolls.length === 0) {
    return 0;
  }

  // Step 2: Calculate total net earnings
  let totalNetEarnings = 0;

  for (const payroll of yearPayrolls) {
    // Sum specific earnings only
    const earnings =
      (payroll.earnings?.halfWeekFixedIncome || 0) +
      this.sumPayrollConcepts(payroll.earnings?.additionalFixedIncomes || []) +
      ((payroll.earnings?.commissions || 0) * COMMISSION_PERCENTAGE_FOR_YEAR_END_BONUS);

    // Sum attendance-related deductions
    const attendanceDeductions =
      (payroll.deductions?.nonCountedDaysDiscount || 0) +
      (payroll.deductions?.justifiedAbsencesDiscount || 0) +
      (payroll.deductions?.unjustifiedAbsencesDiscount || 0) +
      (payroll.deductions?.unworkedHoursDiscount || 0) +
      (payroll.deductions?.tardinessDiscount || 0);

    totalNetEarnings += (earnings - attendanceDeductions);
  }

  // Step 3: Calculate days worked
  const yearStart = new Date(calculationYear, 0, 1);
  const yearEnd = new Date(calculationYear, 11, 31);
  const startDate = hireDate > yearStart ? hireDate : yearStart;
  const daysWorked = this.calculateDaysBetween(startDate, yearEnd) + 1;

  // Step 4: Calculate daily salary
  const dailySalary = totalNetEarnings / daysWorked;

  // Step 5: Apply minimum wage floor
  // TODO: Get minimum wage from salary data
  const minimumDailyWage = 0; // For now, no floor
  const effectiveDailySalary = Math.max(dailySalary, minimumDailyWage);

  // Step 6: Calculate year-end bonus
  const YEAR_END_BONUS_DAYS = 15;
  const proportionalDays = (daysWorked / 365) * YEAR_END_BONUS_DAYS;
  const yearEndBonus = proportionalDays * effectiveDailySalary;

  return Math.round(yearEndBonus * 100) / 100; // Round to 2 decimals
}
```

**Validation:**
- Code compiles
- No TypeScript errors
- Import COMMISSION_PERCENTAGE_FOR_YEAR_END_BONUS at top

**DO NOT TEST YET** - just verify it compiles

---

## Phase 2: Integration into Salary Payroll Calculation

### Step 2.1: Add Parameter to calculateSalaryPayroll
**File:** `src/application/services/payroll.service.ts`

**Change signature:**
```typescript
// BEFORE
private async calculateSalaryPayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date
): Promise<PayrollEstimate>

// AFTER
private async calculateSalaryPayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date,
  calculateYearEndBonus?: boolean  // NEW PARAMETER
): Promise<PayrollEstimate>
```

**Validation:** Code compiles

---

### Step 2.2: Add Year-End Bonus Logic in calculateSalaryPayroll
**File:** `src/application/services/payroll.service.ts`

**Find where `earnings.endYearBonus` is currently set**

**Replace with:**
```typescript
// Calculate year-end bonus if flag is true
if (calculateYearEndBonus === true) {
  const calculationYear = periodEndDate.getFullYear();
  earnings.endYearBonus = await this.calculateYearEndBonus(
    rawData.collaborator.id,
    calculationYear,
    new Date(rawData.employment.hireDate)
  );
} else {
  // Keep existing behavior - use draft value or 0
  earnings.endYearBonus = payrollDraft?.earnings?.endYearBonus || 0;
}
```

**Validation:** Code compiles

---

### Step 2.3: Update calculatePayroll to Pass Parameter
**File:** `src/application/services/payroll.service.ts`

**Find `calculatePayroll` method**

**Update signature:**
```typescript
// BEFORE
private async calculatePayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date
): Promise<PayrollEstimate>

// AFTER
private async calculatePayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date,
  calculateYearEndBonus?: boolean  // NEW
): Promise<PayrollEstimate>
```

**Update call to calculateSalaryPayroll:**
```typescript
// Inside calculatePayroll, find this line:
return this.calculateSalaryPayroll(rawData, periodStartDate, periodEndDate);

// Change to:
return this.calculateSalaryPayroll(rawData, periodStartDate, periodEndDate, calculateYearEndBonus);
```

**Validation:** Code compiles

---

### Step 2.4: Update getPayrollEstimates to Accept Parameter
**File:** `src/application/services/payroll.service.ts`

**Find `getPayrollEstimates` method**

**Update signature:**
```typescript
// Add calculateYearEndBonus parameter
public async getPayrollEstimates(
  queryOptions: CustomQueryOptions,
  calculateYearEndBonus?: boolean  // NEW
): Promise<PayrollEstimate[]>
```

**Update call to calculatePayroll:**
```typescript
// Find where calculatePayroll is called in getPayrollEstimates
// Should be around line ~120-130

// Change from:
const estimate = await this.calculatePayroll(rawData, periodStartDate, periodEndDate);

// To:
const estimate = await this.calculatePayroll(
  rawData,
  periodStartDate,
  periodEndDate,
  calculateYearEndBonus  // Pass through
);
```

**Validation:** Code compiles

---

## Phase 3: Controller Integration

### Step 3.1: Update Controller to Read Query Parameter
**File:** `src/presentation/controllers/payroll.controller.ts`

**Find `getPayrollEstimates` method**

**Update to extract query parameter:**
```typescript
public getPayrollEstimates = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    const query = req.query;
    const options = buildQueryOptions(query);

    // NEW: Extract calculateYearEndBonus parameter
    const calculateYearEndBonus = query.calculateYearEndBonus === 'true';

    // Pass to service
    const data = await this.service.getPayrollEstimates(
      options,
      calculateYearEndBonus  // NEW
    );

    const response = ResponseFormatterService.formatListResponse({
      data,
      path: this.path,
      resource: "payroll-estimate",
      page: options.paginationDto?.page ?? 1,
      limit: options.paginationDto?.limit ?? data.length,
      total: data.length,
    });
    res.json(response);
  } catch (error) {
    next(error);
  }
};
```

**Validation:** Code compiles

---

## Phase 4: Apply Same to Hourly Payroll

### Step 4.1: Update calculateHourlyPayroll
**File:** `src/application/services/payroll.service.ts`

**Find `calculateHourlyPayroll` method**

**Update signature:**
```typescript
// BEFORE
private async calculateHourlyPayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date
): Promise<PayrollEstimate>

// AFTER
private async calculateHourlyPayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date,
  calculateYearEndBonus?: boolean  // NEW
): Promise<PayrollEstimate>
```

**Add year-end bonus logic:**
```typescript
// Find where earnings.endYearBonus is set in hourly payroll
// Add same logic as salary payroll:

if (calculateYearEndBonus === true) {
  const calculationYear = periodEndDate.getFullYear();
  earnings.endYearBonus = await this.calculateYearEndBonus(
    rawData.collaborator.id,
    calculationYear,
    new Date(rawData.employment.hireDate)
  );
} else {
  earnings.endYearBonus = payrollDraft?.earnings?.endYearBonus || 0;
}
```

**Validation:** Code compiles

---

### Step 4.2: Update calculatePayroll to Pass to Hourly
**File:** `src/application/services/payroll.service.ts`

**Find where `calculateHourlyPayroll` is called in `calculatePayroll`**

```typescript
// Change from:
return this.calculateHourlyPayroll(rawData, periodStartDate, periodEndDate);

// To:
return this.calculateHourlyPayroll(rawData, periodStartDate, periodEndDate, calculateYearEndBonus);
```

**Validation:** Code compiles

---

## Phase 5: Testing & Validation

### Step 5.1: Build and Check for Errors
```bash
npm run build
```

**Expected:** Build succeeds with no errors

**If errors:** Fix them before proceeding

---

### Step 5.2: Start Server
```bash
npm run dev
```

**Expected:** Server starts without crashes

---

### Step 5.3: Test WITHOUT Flag (Baseline)
**Purpose:** Verify existing functionality still works

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MWRmZjFjYjQxMzE1OTU5MTFhZDEzZmIiLCJjb2xfY29kZSI6IkpHRyIsInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwiaW1nVXJsIjoiaHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZHdhbGN2OWxpL2ltYWdlL3VwbG9hZC92MTY0MjA2NjM3MC9xbDdsYnJhamliZm9ma2t2b2F3dy5qcGciLCJpYXQiOjE3NjU3MjgwNzcsImV4cCI6MTc2NjMzMjg3N30.nzXO1g3D_HG2QRh1L2TOYEeVE0i-Qb1Ykw0QEVxzdJo"

curl -s "http://localhost:4000/api/payrolls/estimates?periodStartDate=2025-07-01T06:00:00.000Z&periodEndDate=2025-07-16T05:59:59.999Z" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool | grep -A 5 "endYearBonus"
```

**Expected:** `endYearBonus: 0` for all employees

**Validation:** Existing behavior unchanged

---

### Step 5.4: Test WITH Flag (New Feature)
**Purpose:** Verify year-end bonus is calculated

```bash
TOKEN="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOiI2MWRmZjFjYjQxMzE1OTU5MTFhZDEzZmIiLCJjb2xfY29kZSI6IkpHRyIsInJvbGUiOiJBZG1pbmlzdHJhZG9yIiwiaW1nVXJsIjoiaHR0cHM6Ly9yZXMuY2xvdWRpbmFyeS5jb20vZHdhbGN2OWxpL2ltYWdlL3VwbG9hZC92MTY0MjA2NjM3MC9xbDdsYnJhamliZm9ma2t2b2F3dy5qcGciLCJpYXQiOjE3NjU3MjgwNzcsImV4cCI6MTc2NjMzMjg3N30.nzXO1g3D_HG2QRh1L2TOYEeVE0i-Qb1Ykw0QEVxzdJo"

curl -s "http://localhost:4000/api/payrolls/estimates?periodStartDate=2025-07-01T06:00:00.000Z&periodEndDate=2025-07-16T05:59:59.999Z&calculateYearEndBonus=true" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool | grep -A 5 "endYearBonus"
```

**Expected:** `endYearBonus: <some number >0>` for employees with payrolls

**Validation:**
- Year-end bonus is calculated
- Value is reasonable (not 0, not negative, not crazy high)

---

### Step 5.5: Test with Specific Collaborator
**Purpose:** Verify calculation is correct for a known employee

**Pick one collaborator:** (e.g., "SCP" - Silvia Colmenares)

```bash
# Get their collaboratorId from previous response
COLLABORATOR_ID="61e9f7ba11d080f125a93e81"

curl -s "http://localhost:4000/api/payrolls/estimates/$COLLABORATOR_ID?periodStartDate=2025-07-01T06:00:00.000Z&periodEndDate=2025-07-16T05:59:59.999Z&calculateYearEndBonus=true" \
  -H "x-token: $TOKEN" \
  -H "Authorization: Bearer $TOKEN" \
  | python3 -m json.tool
```

**Manual validation:**
1. Note the `endYearBonus` value
2. Check if it makes sense based on their salary
3. Verify it's not absurdly high or low

---

### Step 5.6: Edge Case Testing

**Test 1: Employee with no payrolls in 2025**
- Should return `endYearBonus: 0`

**Test 2: Employee hired mid-year**
- Should return proportional amount

**Test 3: Employee with absences**
- Should return lower amount than base salary would suggest

---

## Phase 6: Recalculate Endpoint Support

### Step 6.1: Update recalculatePayroll Method
**File:** `src/application/services/payroll.service.ts`

**Find `recalculatePayroll` method**

**Check if it calls `calculatePayroll`**
- If yes, add `calculateYearEndBonus` parameter
- If no, skip this step

**Validation:** Code compiles

---

### Step 6.2: Update Controller recalculatePayroll
**File:** `src/presentation/controllers/payroll.controller.ts`

**Extract query parameter:**
```typescript
const calculateYearEndBonus = req.query.calculateYearEndBonus === 'true';
```

**Pass to service if needed**

**Validation:** Code compiles

---

## Phase 7: Documentation & Cleanup

### Step 7.1: Add JSDoc Comments
**File:** `src/application/services/payroll.service.ts`

**Add documentation to new method:**
```typescript
/**
 * Calculates the year-end bonus (aguinaldo) for a collaborator
 *
 * Formula:
 * 1. Sum all earnings (base salary + additional incomes + 50% commissions)
 * 2. Subtract attendance-related deductions
 * 3. Calculate daily salary = total net earnings / days worked
 * 4. Apply minimum wage floor
 * 5. Calculate bonus = (days worked / 365) * 15 * daily salary
 *
 * @param collaboratorId - ID of the collaborator
 * @param calculationYear - Year to calculate for (e.g., 2025)
 * @param hireDate - Date the employee was hired
 * @returns Year-end bonus amount (rounded to 2 decimals)
 */
private async calculateYearEndBonus(...)
```

---

### Step 7.2: Update API Documentation
**File:** Create or update API docs

**Document new query parameter:**
```
GET /api/payrolls/estimates

Query Parameters:
- periodStartDate (required): ISO date
- periodEndDate (required): ISO date
- calculateYearEndBonus (optional): "true" | "false"
  - If "true", calculates year-end bonus automatically
  - If not provided or "false", uses draft value or 0
```

---

## Summary Checklist

- [ ] Phase 0: Fixtures and constants created
- [ ] Phase 1: Core calculation function implemented
- [ ] Phase 2: Integrated into salary payroll
- [ ] Phase 3: Controller updated
- [ ] Phase 4: Hourly payroll updated
- [ ] Phase 5: All tests pass
- [ ] Phase 6: Recalculate endpoint updated
- [ ] Phase 7: Documentation complete

---

## Rollback Plan

If something breaks:

1. **Revert last commit:**
   ```bash
   git reset --hard HEAD~1
   ```

2. **Or disable feature:**
   - Comment out the year-end bonus calculation
   - Default `calculateYearEndBonus` to `false`

3. **Emergency fix:**
   - Remove query parameter handling
   - Always set `endYearBonus = 0`

---

## Next Steps After Implementation

1. Add unit tests
2. Add integration tests
3. Consider adding minimum wage floor logic
4. Consider adding validation for calculation year
5. Add logging for debugging
