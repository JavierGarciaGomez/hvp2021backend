# Year-End Bonus - Implementation Strategy

## Philosophy: "Know the target before you build"

**Key principle:** Always validate with real API calls after each change

---

## PHASE 1: UNDERSTAND THE CURRENT STATE (With Real Data)

### Goal
Know EXACTLY what data we have and what the result SHOULD be before writing any code

### Steps

**1.1 Pick Test Subjects (Real Collaborators)**
- Make API call to get current payroll estimates
- Pick 2 collaborators:
  - **Subject A**: Employee with full year of work (hired before 2025)
  - **Subject B**: Employee hired mid-2025
- Save their `collaboratorId` for future tests

**1.2 Get Their Historical Data**
- Make API calls to get ALL their payrolls from 2025
- Endpoint: `GET /api/payrolls?collaboratorId=X&periodEndDate[$gte]=2025-01-01&periodEndDate[$lte]=2025-12-31`
- Save the response to a file for reference

**1.3 Manual Calculation (Excel/Calculator)**
For each test subject:
- Sum all `halfWeekFixedIncome` from their payrolls
- Sum all `additionalFixedIncomes`
- Sum all `commissions`, multiply by 0.5
- Sum all attendance deductions
- Calculate: net earnings / days worked = daily salary
- Calculate: (days worked / 365) * 15 * daily salary = expected aguinaldo
- **WRITE DOWN THE EXPECTED NUMBER**

This becomes our "target" - what the code should return

**Validation:** We have concrete numbers to compare against

---

## PHASE 2: BUILD THE CALCULATION (Isolated & Safe)

### Goal
Create the calculation function WITHOUT touching anything that exists

### Steps

**2.1 Add New Constant**
- File: `src/shared/constants/hris.constants.ts`
- Add: `COMMISSION_PERCENTAGE_FOR_YEAR_END_BONUS = 0.5`
- Build: `npm run build` → should succeed

**2.2 Create Helper Method: calculateDaysBetween**
- File: `src/application/services/payroll.service.ts`
- Add private method
- Note: Simple date math, returns number of days
- No API calls, pure calculation

**2.3 Create Helper Method: sumPayrollConcepts**
- Same file
- Takes array of `PayrollConcept[]`, returns sum
- Pure function, no side effects

**2.4 Create Main Calculation Method**
- Method: `calculateYearEndBonus(collaboratorId, year, hireDate)`
- Make it private (not exposed yet)
- Logic:
  - Query DB for all payrolls of that collaborator in that year
  - Loop through payrolls
  - Sum the 3 earnings types (base, additional, commissions*0.5)
  - Sum the 5 attendance deductions
  - Calculate net = earnings - deductions
  - Calculate days worked
  - Calculate daily salary = total net / days worked
  - Calculate aguinaldo = (days/365) * 15 * daily salary
  - Return rounded number

**2.5 Manual Testing (Before Integration)**
- Add a temporary console.log or test
- Call the function directly with Subject A's collaboratorId
- Compare result with manual calculation from Phase 1
- Adjust if needed
- Remove test code

**Validation:** Function returns expected values for our test subjects

---

## PHASE 3: INTEGRATE WITH SAFETY OFF (Won't Break Anything)

### Goal
Connect the new code to existing flow, but disabled by default

### Steps

**3.1 Update Method Signatures (Add Optional Parameter)**
- Methods to update:
  - `calculateSalaryPayroll` → add `calculateYearEndBonus?: boolean`
  - `calculateHourlyPayroll` → add same parameter
  - `calculatePayroll` → add same parameter
  - `getPayrollEstimates` → add same parameter
- Note: Optional parameter, defaults to undefined/false
- Pass the parameter through the chain

**3.2 Add Conditional Logic**
- In `calculateSalaryPayroll` where `earnings.endYearBonus` is set:
  - IF `calculateYearEndBonus === true` → call our new function
  - ELSE → keep existing behavior (draft value or 0)
- Same for `calculateHourlyPayroll`

**3.3 Update Controller**
- File: `src/presentation/controllers/payroll.controller.ts`
- In `getPayrollEstimates` method:
  - Read `req.query.calculateYearEndBonus`
  - Convert to boolean (only true if === 'true')
  - Pass to service

**3.4 Build & Deploy**
```bash
npm run build
npm run dev
```

**3.5 CRITICAL TEST: Verify Nothing Broke**
- Make API call WITHOUT the new flag
- Endpoint: same as before, NO `calculateYearEndBonus` parameter
- Expected: Exact same response as before
- All `endYearBonus` should still be 0 (or draft values)

**Validation:** Existing functionality unchanged

---

## PHASE 4: ACTIVATE & VALIDATE (The Moment of Truth)

### Goal
Turn on the feature and verify it works with real data

### Steps

**4.1 Test WITH Flag (Subject A)**
- Make API call with `calculateYearEndBonus=true`
- For Subject A (full year employee)
- Compare `endYearBonus` in response with manual calculation from Phase 1
- Should be close (within 1-2% due to rounding)

**4.2 Test Subject B (Mid-Year Hire)**
- Same call with Subject B's collaboratorId
- Compare with manual calculation
- Should be proportional (roughly half if hired mid-year)

**4.3 Test Edge Cases**
- Employee with no payrolls in 2025 → should return 0
- Employee with many absences → should return lower amount

**4.4 Adjust if Needed**
- If results don't match:
  - Add console.logs to see intermediate values
  - Check which part of calculation is off
  - Fix
  - Rebuild
  - Test again

**Validation:** API returns correct year-end bonus values

---

## PHASE 5: POLISH & EDGE CASES

### Goal
Handle edge cases and add nice-to-haves

### Steps

**5.1 Add Minimum Wage Floor**
- Get minimum wage from salary data for the year
- Compare daily salary with minimum
- Use the higher value
- Test with low-salary employee

**5.2 Handle Employee Termination**
- What if employee left mid-year?
- Should calculate up to termination date, not Dec 31
- Note: Might need additional logic to detect this

**5.3 Add Logging**
- Log when year-end bonus is calculated
- Log the values for debugging
- Makes troubleshooting easier

**5.4 Documentation**
- Add JSDoc comments to the method
- Document the formula
- Add examples

**Validation:** All edge cases handled gracefully

---

## PHASE 6: UPDATE RELATED ENDPOINTS

### Goal
Ensure recalculate and other endpoints support the new flag

### Steps

**6.1 Check recalculatePayroll Method**
- Does it call `calculatePayroll`?
- If yes, add the parameter support
- Test recalculate with the flag

**6.2 Check getPayrollEstimateByCollaboratorId**
- Single collaborator endpoint
- Should also support the flag
- Test it

**Validation:** All endpoints consistent

---

## Testing Commands Reference

**Get token (if expired):**
```bash
curl -s -X POST http://localhost:4000/api/auth/collaborator/login \
  -H "Content-Type: application/json" \
  -d '{"email": "javieron.garcia@gmail.com", "password": "secret"}' \
  | python3 -c "import sys, json; print(json.load(sys.stdin)['token'])"
```

**Test without flag (baseline):**
```bash
curl -s "http://localhost:4000/api/payrolls/estimates?periodStartDate=2025-12-16&periodEndDate=2025-12-31" \
  -H "x-token: $TOKEN" | python3 -m json.tool > baseline.json
```

**Test with flag:**
```bash
curl -s "http://localhost:4000/api/payrolls/estimates?periodStartDate=2025-12-16&periodEndDate=2025-12-31&calculateYearEndBonus=true" \
  -H "x-token: $TOKEN" | python3 -m json.tool > with-aguinaldo.json
```

**Compare:**
```bash
diff baseline.json with-aguinaldo.json
```

---

## Rollback Plan

If something breaks at any phase:

**Phase 2:** Just delete the new method, nothing else changed

**Phase 3:** Comment out the new logic, set `endYearBonus = 0`

**Phase 4-6:** Set default value of `calculateYearEndBonus` to `false`

---

## Success Criteria

- [ ] Existing API calls (without flag) work exactly as before
- [ ] New API calls (with flag) return reasonable year-end bonus values
- [ ] Manual calculations match API results within 2%
- [ ] Edge cases handled (no payrolls, mid-year hire, etc.)
- [ ] No crashes or errors in any scenario
- [ ] Code is clean and documented

---

## Why This Strategy Works

1. **Real data first** → We know what success looks like
2. **Isolated building** → Can't break existing code
3. **Safe integration** → Feature is off by default
4. **Incremental validation** → Catch errors early
5. **Easy rollback** → Can undo at any step
6. **Real testing** → Not relying on mocks or theory

---

## Time Estimate

- Phase 1: 30 min (API calls + manual calc)
- Phase 2: 1-2 hours (build function + test)
- Phase 3: 30 min (integrate safely)
- Phase 4: 30 min (activate + validate)
- Phase 5: 1 hour (polish)
- Phase 6: 30 min (other endpoints)

**Total: 4-5 hours** (with testing and validation)
