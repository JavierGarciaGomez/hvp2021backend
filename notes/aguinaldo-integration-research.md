# Investigación: Integración de Cálculo de Aguinaldo

## Contexto Actual

### Sistema Existente
- **Frecuencia de cálculo**: Quincenal (cada 15 días)
- **Endpoint principal**: `GET /api/payrolls/estimates`
- **Servicio**: `PayrollService.calculatePayroll()`
- **Tipos de pago**: Salario fijo y por hora

### Estado Actual del Aguinaldo
Actualmente, el aguinaldo (`endYearBonus`) se maneja como:
- Campo editable desde el frontend (`payrollDraft`)
- Sin cálculo automático
- Se incluye en el cálculo de ISR con un tope de 30 UMA
- Ubicación en código: `src/application/services/payroll.service.ts:620,834-839`

### Constantes Relacionadas
```typescript
YEAR_END_BONUS_DAYS = 15  // Días de aguinaldo base
```

---

## Requisitos Legales del Aguinaldo (México)

1. **Cantidad**: Mínimo 15 días de salario
2. **Plazo de pago**: Antes del 20 de diciembre
3. **Cálculo proporcional**:
   - Días trabajados en el año / 365 * 15 días de salario
   - Solo se cuentan días efectivamente trabajados
4. **Base de cálculo**: Salario diario integrado (puede incluir comisiones promedio)
5. **ISR**: Está gravado, con exención hasta 30 días de UMA

---

## Contexto Aclarado

**IMPORTANTE**: El aguinaldo NO es una nómina separada. Es la **misma nómina quincenal regular** que incluye el aguinaldo como un concepto adicional (`endYearBonus`) en el earnings.

**Flujo actual del frontend:**
1. Llama `GET /api/payrolls/estimates?periodStartDate=...&periodEndDate=...` (todos los colaboradores)
2. Recibe los estimates con valores calculados
3. Usuario puede hacer ajustes manuales a los valores
4. Puede recalcular si es necesario

**Objetivo**: Que en la nómina de diciembre (o cuando corresponda), el campo `endYearBonus` venga **automáticamente calculado** en lugar de vacío/cero.

---

## Estrategias Propuestas

### 🏆 Estrategia 1: Detección Automática por Fecha (RECOMENDADA)

**Descripción:**
El backend detecta automáticamente si el período corresponde al pago de aguinaldo (segunda quincena de diciembre) y calcula el `endYearBonus` automáticamente.

**Implementación:**
```typescript
// En calculateSalaryPayroll() / calculateHourlyPayroll()
const isAguinaldoPeriod = periodEndDate.getMonth() === 11 && // Diciembre
                         periodEndDate.getDate() >= 16;      // Segunda quincena

if (isAguinaldoPeriod) {
  earnings.endYearBonus = await calculateAguinaldo(rawData, periodEndDate);
} else {
  earnings.endYearBonus = 0; // o el valor del draft si existe
}
```

**Pros:**
- ✅ **Cero cambios en frontend** - funciona exactamente igual
- ✅ **Completamente automático** - no se olvidan de calcularlo
- ✅ **Simple y directo** - lógica clara y mantenible
- ✅ **Usuario puede editarlo después** - flujo actual se mantiene
- ✅ **No afecta otras quincenas** - solo diciembre

**Contras:**
- ⚠️ No permite calcular aguinaldo en otras fechas (adelantos)
- ⚠️ Si un año quieren pagarlo en noviembre, hay que cambiar código
- ⚠️ No hay forma de "apagarlo" si no quieren pagarlo ese año

**Complejidad:** Baja

---

### Estrategia 2: Flag Booleano Simple

**Descripción:**
Añadir un parámetro query opcional `calculateAguinaldo` que cuando está en `true`, calcula el aguinaldo.

**Implementación:**
```typescript
// Query parameter (opcional)
GET /api/payrolls/estimates?periodStartDate=2025-12-16&periodEndDate=2025-12-31&calculateAguinaldo=true

// En el service
if (queryParams.calculateAguinaldo === true) {
  earnings.endYearBonus = await calculateAguinaldo(rawData, periodEndDate);
}
```

**Pros:**
- ✅ **Flexibilidad total** - se puede calcular en cualquier quincena
- ✅ **Permite adelantos** - útil si empleados piden adelanto en octubre
- ✅ **Control explícito** - frontend decide cuándo calcularlo
- ✅ **Fácil de apagar** - simplemente no enviar el parámetro

**Contras:**
- ⚠️ **Requiere cambio en frontend** - hay que acordarse de enviarlo
- ⚠️ **Riesgo de olvido** - si frontend no lo envía, no se calcula
- ⚠️ **Menos automático** - depende de acción manual

**Complejidad:** Baja

---

### 🎯 Estrategia 3: Híbrida - Auto + Override (MEJOR OPCIÓN)

**Descripción:**
Combinar ambas: detección automática por defecto, con flag para forzar u omitir el cálculo.

**Implementación:**
```typescript
// Query parameters opcionales
// 1. Sin parámetro: comportamiento automático
GET /api/payrolls/estimates?periodStartDate=2025-12-16&periodEndDate=2025-12-31

// 2. Forzar cálculo en octubre (adelanto)
GET /api/payrolls/estimates?periodStartDate=2025-10-16&periodEndDate=2025-10-31&calculateAguinaldo=true

// 3. Omitir cálculo aunque sea diciembre
GET /api/payrolls/estimates?periodStartDate=2025-12-16&periodEndDate=2025-12-31&calculateAguinaldo=false

// Lógica
const shouldCalculateAguinaldo =
  queryParams.calculateAguinaldo === true ||  // Forzado explícitamente
  (queryParams.calculateAguinaldo !== false && isDecemberSecondHalf); // Auto, si no está deshabilitado

if (shouldCalculateAguinaldo) {
  earnings.endYearBonus = await calculateAguinaldo(rawData, periodEndDate);
}
```

**Pros:**
- ✅ **Lo mejor de ambos mundos** - automático pero flexible
- ✅ **Cero cambios en frontend para caso normal** - funciona automático
- ✅ **Permite adelantos** - solo cuando sea necesario
- ✅ **Permite omitir** - si hay razón especial
- ✅ **Usuario puede editar después** - flujo actual se mantiene

**Contras:**
- ⚠️ Lógica ligeramente más compleja (pero no mucho)
- ⚠️ Dos comportamientos posibles puede confundir

**Complejidad:** Baja-Media

### Comparación Rápida

| Aspecto | Estrategia 1 (Auto) | Estrategia 2 (Flag) | Estrategia 3 (Híbrida) |
|---------|-------------------|-------------------|---------------------|
| Cambios en frontend | Ninguno | Debe enviar flag | Ninguno (opcional para casos especiales) |
| Flexibilidad | Baja | Alta | Alta |
| Riesgo de olvido | Ninguno | Alto | Ninguno |
| Complejidad | Baja | Baja | Baja-Media |
| Adelantos | No soporta | Soporta | Soporta |
| Automatización | Total | Manual | Total + Manual |

---

## Cálculo Técnico del Aguinaldo

### Fórmula Base
```typescript
function calculateAguinaldo(rawData: PayrollCollaboratorRawData): number {
  const { collaborator, employment } = rawData;

  // 1. Determinar días trabajados en el año
  const hireDate = new Date(employment.hireDate);
  const yearStart = new Date(currentYear, 0, 1);
  const startDate = hireDate > yearStart ? hireDate : yearStart;
  const daysWorked = calculateDaysBetween(startDate, new Date());

  // 2. Calcular salario diario base
  const dailySalary = calculateDailySalary(employment);

  // 3. Calcular aguinaldo proporcional
  const proportionalDays = (daysWorked / 365) * YEAR_END_BONUS_DAYS;
  const aguinaldo = proportionalDays * dailySalary;

  return aguinaldo;
}

function calculateDailySalary(employment: Employment): number {
  if (employment.paymentType === HRPaymentType.SALARY) {
    // Para salario fijo: salario mensual / 30
    return employment.monthlyFixedIncome / 30;
  } else {
    // Para por hora: horas diarias * tarifa por hora
    return DAILY_WORK_HOURS * employment.hourlyRate;
  }
}
```

### Consideraciones Adicionales

**¿Incluir comisiones en la base?**
- Legalmente, las comisiones DEBEN incluirse si son regulares
- Opción: Calcular promedio mensual de comisiones del año
- Sumar al salario base para calcular salario diario integrado

```typescript
function calculateIntegratedDailySalary(rawData): number {
  const baseDailySalary = calculateDailySalary(employment);

  // Promedio mensual de comisiones del año
  const yearCommissions = await getYearCommissions(collaboratorId, year);
  const avgMonthlyCommissions = yearCommissions.total / 12;
  const dailyCommissions = avgMonthlyCommissions / 30;

  return baseDailySalary + dailyCommissions;
}
```

**¿Qué pasa con ausencias injustificadas?**
- Legalmente, se descuentan días de ausencias injustificadas
- Necesitas restar esos días del cálculo de días trabajados

```typescript
const unjustifiedAbsences = await getYearUnjustifiedAbsences(collaboratorId, year);
const effectiveDaysWorked = daysWorked - unjustifiedAbsences;
```

---

## Recomendación Final

### 🎯 Estrategia Recomendada: **Estrategia 3 - Híbrida (Auto + Override)**

**Razones:**
1. **Cero impacto en frontend** - No requiere cambios para el caso normal
2. **Automático por defecto** - Se calcula solo en diciembre sin intervención
3. **Flexibilidad cuando se necesita** - Permite adelantos y casos especiales con flag opcional
4. **Mejor UX** - Usuario ve el valor calculado y puede ajustarlo si necesita
5. **Simple de implementar** - Solo backend, complejidad baja-media

Esta estrategia te da:
- ✅ Comportamiento automático en diciembre → Cero trabajo adicional
- ✅ Posibilidad de adelantos → `?calculateAguinaldo=true` en octubre
- ✅ Posibilidad de omitir → `?calculateAguinaldo=false` si hay razón especial
- ✅ Ajustes manuales después → El flujo actual de edición se mantiene intacto

### Plan de Implementación

#### Fase 1: Backend - Modificar Controller
**Archivo**: `src/presentation/controllers/payroll.controller.ts`

```typescript
// Añadir parámetro opcional en getPayrollEstimates
async getPayrollEstimates(req: Request, res: Response) {
  const { periodStartDate, periodEndDate, calculateAguinaldo } = req.query;

  // Parsear calculateAguinaldo como booleano si viene
  const shouldCalculateAguinaldo = calculateAguinaldo === 'true' ? true :
                                   calculateAguinaldo === 'false' ? false :
                                   undefined; // undefined = comportamiento automático

  const estimates = await this.payrollService.getPayrollEstimates(
    periodStartDate,
    periodEndDate,
    shouldCalculateAguinaldo
  );

  return res.json(estimates);
}
```

#### Fase 2: Backend - Modificar Service
**Archivo**: `src/application/services/payroll.service.ts`

```typescript
// 1. Modificar firma de getPayrollEstimates
async getPayrollEstimates(
  periodStartDate: Date,
  periodEndDate: Date,
  calculateAguinaldo?: boolean  // <-- Nuevo parámetro opcional
): Promise<PayrollEstimate[]>

// 2. Pasar el parámetro a calculatePayroll
const estimate = await this.calculatePayroll(
  rawData,
  periodStartDate,
  periodEndDate,
  calculateAguinaldo  // <-- Pasar aquí
);

// 3. Modificar calculatePayroll para aceptar el parámetro
private async calculatePayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date,
  calculateAguinaldo?: boolean  // <-- Nuevo
): Promise<PayrollEstimate>

// 4. Pasar a calculateSalaryPayroll / calculateHourlyPayroll
if (employment.paymentType === HRPaymentType.SALARY) {
  return this.calculateSalaryPayroll(rawData, periodStartDate, periodEndDate, calculateAguinaldo);
} else {
  return this.calculateHourlyPayroll(rawData, periodStartDate, periodEndDate, calculateAguinaldo);
}
```

#### Fase 3: Backend - Implementar Lógica de Aguinaldo
**Archivo**: `src/application/services/payroll.service.ts`

```typescript
// En calculateSalaryPayroll, después de calcular otros earnings:
private async calculateSalaryPayroll(
  rawData: PayrollCollaboratorRawData,
  periodStartDate: Date,
  periodEndDate: Date,
  calculateAguinaldo?: boolean
): Promise<PayrollEstimate> {
  // ... código existente ...

  // NUEVO: Determinar si calcular aguinaldo
  const isDecemberSecondHalf = periodEndDate.getMonth() === 11 &&
                               periodEndDate.getDate() >= 16;

  const shouldCalculateAguinaldo =
    calculateAguinaldo === true ||  // Forzado explícitamente
    (calculateAguinaldo !== false && isDecemberSecondHalf); // Auto si no está deshabilitado

  // Calcular aguinaldo si corresponde
  if (shouldCalculateAguinaldo) {
    earnings.endYearBonus = await this.calculateAguinaldo(
      rawData,
      periodEndDate
    );
  } else {
    // Mantener el valor del draft si existe, o 0
    earnings.endYearBonus = payrollDraft?.earnings?.endYearBonus || 0;
  }

  // ... resto del código ...
}

// NUEVO: Método para calcular aguinaldo
private async calculateAguinaldo(
  rawData: PayrollCollaboratorRawData,
  calculationDate: Date
): Promise<number> {
  const { employment } = rawData;
  const currentYear = calculationDate.getFullYear();

  // 1. Calcular días trabajados en el año
  const hireDate = new Date(employment.hireDate);
  const yearStart = new Date(currentYear, 0, 1);
  const startDate = hireDate > yearStart ? hireDate : yearStart;
  const daysWorked = this.calculateDaysBetween(startDate, calculationDate);

  // 2. TODO: Descontar ausencias injustificadas (si aplica)
  // const unjustifiedAbsences = await this.getYearUnjustifiedAbsences(...)
  // const effectiveDaysWorked = daysWorked - unjustifiedAbsences;

  // 3. Calcular salario diario
  const dailySalary = await this.calculateDailySalaryForAguinaldo(rawData, currentYear);

  // 4. Calcular aguinaldo proporcional
  const proportionalDays = (daysWorked / 365) * YEAR_END_BONUS_DAYS;
  const aguinaldo = proportionalDays * dailySalary;

  return aguinaldo;
}

// NUEVO: Calcular salario diario para aguinaldo
private async calculateDailySalaryForAguinaldo(
  rawData: PayrollCollaboratorRawData,
  year: number
): Promise<number> {
  const { employment } = rawData;

  let baseDailySalary: number;

  if (employment.paymentType === HRPaymentType.SALARY) {
    // Salario mensual / 30 días
    baseDailySalary = employment.monthlyFixedIncome / 30;
  } else {
    // Por hora: horas diarias * tarifa
    baseDailySalary = DAILY_WORK_HOURS * employment.hourlyRate;
  }

  // TODO: Incluir comisiones si aplica
  // const yearCommissions = await this.getYearCommissions(rawData.collaborator.id, year);
  // const avgMonthlyCommissions = yearCommissions / 12;
  // const dailyCommissions = avgMonthlyCommissions / 30;
  // return baseDailySalary + dailyCommissions;

  return baseDailySalary;
}

// NUEVO: Helper para calcular días entre fechas
private calculateDaysBetween(startDate: Date, endDate: Date): number {
  const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
```

**Mismo cambio para `calculateHourlyPayroll`**

#### Fase 4: Testing
```typescript
// Unit tests en payroll.service.spec.ts

describe('calculateAguinaldo', () => {
  it('calcula aguinaldo completo para empleado año entero', async () => {
    // empleado desde enero, salario $10,000/mes
    // aguinaldo = 15 días * (10000/30) = $5,000
  });

  it('calcula aguinaldo proporcional para nuevo ingreso', async () => {
    // empleado desde julio (184 días)
    // aguinaldo = (184/365) * 15 días * salario_diario
  });

  it('respeta flag calculateAguinaldo=true fuera de diciembre', async () => {
    // período octubre, pero calculateAguinaldo=true
    // debe calcular aguinaldo
  });

  it('respeta flag calculateAguinaldo=false en diciembre', async () => {
    // período diciembre, pero calculateAguinaldo=false
    // no debe calcular aguinaldo
  });
});
```

---

## Casos de Uso a Considerar

### Caso 1: Empleado con Año Completo
- Trabajó del 1 enero al 31 diciembre
- Aguinaldo = 15 días de salario completo

### Caso 2: Empleado de Nuevo Ingreso
- Ingresó el 1 de julio
- Días trabajados = 184 días (aprox)
- Aguinaldo = (184/365) * 15 días = 7.56 días de salario

### Caso 3: Empleado con Comisiones Variables
- Salario base: $10,000/mes
- Comisiones anuales: $60,000
- Salario integrado mensual: $10,000 + ($60,000/12) = $15,000
- Salario diario: $15,000 / 30 = $500
- Aguinaldo = 15 * $500 = $7,500

### Caso 4: Empleado con Ausencias Injustificadas
- Días calendario trabajados: 365
- Ausencias injustificadas: 5 días
- Días efectivos: 360
- Aguinaldo = (360/365) * 15 días = 14.79 días de salario

### Caso 5: Adelanto de Aguinaldo
- Empleado solicita adelanto el 1 de diciembre
- Calcular proporcional con `payrollType=aguinaldo` en esa fecha
- Al calcular nómina final, restar el adelanto ya pagado

---

## Preguntas para Aclarar

Antes de implementar, sería bueno confirmar:

1. **¿Se deben incluir comisiones en la base de cálculo?**
   - Sí → Calcular promedio anual
   - No → Solo salario base

2. **¿Se manejan adelantos de aguinaldo?**
   - Sí → Necesitamos tracking de adelantos pagados
   - No → Simplifica implementación

3. **¿Qué pasa con ausencias injustificadas?**
   - Se descuentan → Necesitamos query de ausencias anuales
   - No se descuentan → Más simple

4. **¿Se debe calcular automáticamente o siempre manual?**
   - Automático con override → Estrategia 5
   - Automático según parámetro → Estrategia 1 (recomendada)

5. **¿Necesitan provisión contable mensual/quincenal?**
   - Sí → Estrategia 4 (más complejo)
   - No → Estrategias 1-3 suficientes

6. **¿Habrá otros pagos especiales similares (PTU, finiquitos)?**
   - Sí → Estrategia 1 es la mejor base
   - No → Puede ser más simple

---

## Estimación de Esfuerzo

### Estrategia 1 (Recomendada):
- **Backend**:
  - Enum y routing: 1-2 horas
  - Lógica de cálculo: 4-6 horas
  - Tests: 3-4 horas
  - **Total: ~10-12 horas**

- **Frontend**:
  - UI para selector de tipo: 2-3 horas
  - Integración API: 1-2 horas
  - Ajustes en display: 2-3 horas
  - **Total: ~5-8 horas**

- **Testing integral**: 2-3 horas

**TOTAL: ~17-23 horas**

---

## Próximos Pasos

1. ✅ **Validar estrategia** con stakeholders
2. ✅ **Aclarar preguntas** sobre reglas de negocio
3. ⏳ **Crear plan detallado** de implementación
4. ⏳ **Implementar** backend + frontend
5. ⏳ **Testing** exhaustivo con casos reales
6. ⏳ **Deploy** y validación en producción
