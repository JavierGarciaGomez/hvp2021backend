# Planning Rules - HVP2021 Backend

> **Base Rules:** See `hvp-workspace/.claude/rules/planning.md` for general planning conventions.
>
> This file contains **backend-specific** rules that extend the workspace rules.

---

## Payroll-Specific Rules

### Critical Compliance Checks

When planning changes to payroll system, ALWAYS verify:

1. **Timezone:** Mexico timezone used for all date operations
2. **UMA Values:** Current values used (2024: $108.57 daily)
3. **Tax-Exempt Limits:** Correct limits applied per Mexican law
4. **Clean Architecture:** Domain layer purity maintained
5. **Authentication:** Dual-header JWT requirement not broken

### Code Examples

```typescript
// ✅ CORRECT: Mexico timezone
import moment from 'moment-timezone';
const year = moment.tz(periodEnd, 'America/Mexico_City').year();

// ❌ INCORRECT: UTC timezone
const year = new Date(periodEnd).getFullYear();
```

### High-Risk Areas

Pay extra attention when planning changes to:
- `src/domain/services/PayrollCalculation.ts`
- `src/application/services/PayrollCalculationService.ts`
- Any file with "tax", "ISR", "IMSS", or "aguinaldo" in name
- Date/time handling functions

### Testing Requirements

All payroll plans MUST include:
- Edge cases for UMA limits (exactly at limit, 1 peso above/below)
- Timezone tests (verify Mexico timezone used)
- Tax calculation tests with known correct values
- Integration tests with real employee data

---

## Tax-Exempt Limits (Mexican Law)

| Concept | Exempt Amount |
|---------|---------------|
| Aguinaldo (End-year bonus) | First 30 UMA days |
| Prima Vacacional (Vacation bonus) | First 15 UMA days |
| Overtime | First 5 UMA per period |
| Sunday Bonus | First 1 UMA per Sunday |
| PTU (Profit sharing) | First 15 UMA days |

### Current UMA Value (2024)
- Daily: $108.57 MXN
- Monthly: $3,300.53 MXN
- Annual: $39,606.36 MXN

---

## Backend Plan Storage

Backend-specific plans go in:
```
hvp2021backend/.claude/plans/active/
```

Cross-repo plans go in the parent:
```
hvp-workspace/.claude/plans/active/
```

---

## GitHub Repository

**Repository:** https://github.com/JavierGarciaGomez/hvp2021backend

---

**Last Updated:** 2026-01-03
