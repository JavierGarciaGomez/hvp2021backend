# Coding Conventions

## Language Rules

### ✅ ALL CODE MUST BE IN ENGLISH

- **Variables**: English only
- **Functions**: English only
- **Classes**: English only
- **Comments**: English only
- **Types/Interfaces**: English only
- **Constants**: English only
- **File names**: English only

### Examples

#### ❌ WRONG (Spanish)
```typescript
const aguinaldo = calcularAguinaldo();
const diasTrabajados = 365;
function obtenerNomina() { }
```

#### ✅ CORRECT (English)
```typescript
const yearEndBonus = calculateYearEndBonus();
const workedDays = 365;
function getPayroll() { }
```

### Spanish Business Terms Translation

| Spanish Term | English Term (used in code) |
|--------------|----------------------------|
| Aguinaldo | `yearEndBonus` |
| Nómina | `payroll` |
| Quincena | `halfWeek` or `period` |
| Salario | `salary` |
| Colaborador | `collaborator` |
| Vacaciones | `vacation` |
| Prima vacacional | `vacationBonus` |
| Días trabajados | `workedDays` |
| Ausencias | `absences` |
| Comisiones | `commissions` |
| Horas extras | `overtime` |
| IMSS | `socialSecurity` |
| ISR | `incomeTax` |
| PTU | `profitSharing` |
| Finiquito | `settlement` |

### Why English?

1. **International standard** - Most programming languages, libraries, and frameworks use English
2. **Consistency** - Mixing Spanish and English creates confusion
3. **Maintainability** - Future developers (including non-Spanish speakers) can understand the code
4. **Best practices** - Industry standard across professional codebases

### Exception

The ONLY exception is:
- **User-facing text** (error messages shown to users, labels, etc.) - these can be in Spanish
- **Documentation** (README, notes) - can be in Spanish if needed

But **ALL code** must be in English.