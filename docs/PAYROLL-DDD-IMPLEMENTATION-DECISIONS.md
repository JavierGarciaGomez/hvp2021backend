# Payroll DDD - Decisiones de Implementación

**Fecha:** 2025-12-17
**Estado:** En definición

---

## 1. Arquitectura General

### ✅ Confirmado
- **Arquitectura DDD:** Sí, usar Domain-Driven Design
- **Código nuevo vs refactor:** Crear TODO nuevo, código legacy no se toca
- **Rutas:** `/api/v2/payrolls` (v2)
- **Value Objects:** Usar los ya creados (Money, RFC, CURP, CFDIPerception, etc.)
- **Aggregate:** Usar PayrollAggregate ya creado
- **Use Cases:** Usar los ya creados (GenerateCFDI, CreatePayroll, etc.)

---

## 2. Schema de MongoDB

### ✅ Confirmado por usuario
- **NO snapshots embebidos:** El schema solo tiene referencias (IDs)
- **Datos estáticos:** Van dentro de `cfdiData` u otro campo (NO como snapshots separados)

### Schema Propuesto (Pendiente de confirmar)

```typescript
{
  // Referencias (solo IDs)
  collaboratorId: ObjectId,
  employmentId: ObjectId,
  jobId: ObjectId,

  // Periodo
  periodStartDate: Date,
  periodEndDate: Date,

  // Earnings y Deductions (¿Mantener estructura actual?)
  earnings: { ... },
  deductions: { ... },

  // Totales
  totals: {
    totalIncome: Number,
    totalDeductions: Number,
    netPay: Number
  },

  // Status
  status: String, // 'Pending' | 'Approved' | 'Paid' | 'Cancelled'

  // CFDI (contiene datos estáticos para Facturama)
  cfdiData: {
    // ¿Aquí van los datos estáticos del empleado?
    // receiver, employee, perceptions, deductions, etc.
  },

  // Metadata
  createdBy: ObjectId,
  createdAt: Date,
  updatedAt: Date
}
```

---

## 3. Respuestas de API

### ✅ Confirmado por usuario
- **ID + Datos populados:** Response incluye collaboratorId (ID) + collaborator (datos actuales)
- **Propósito:** Facilitar trabajo del frontend

### Response Propuesto (Pendiente de confirmar)

```typescript
{
  id: "123",

  // Referencias
  collaboratorId: "abc",
  employmentId: "def",
  jobId: "ghi",

  // Datos populados (del momento actual)
  collaborator: {
    id: "abc",
    fullName: "Juan Pérez",
    email: "juan@example.com",
    // ¿Qué más incluir?
  },

  employment: {
    // ¿Populamos employment también?
  },

  job: {
    // ¿Populamos job también?
  },

  // Periodo, earnings, deductions, totals...

  // CFDI (si existe)
  cfdiData: { ... }
}
```

---

## 4. Datos Estáticos para CFDI

### ✅ Confirmado por usuario
- **NO usar snapshots de recursos existentes**
- **Datos van en cfdiData (u otro campo)**

### ✅ Respuestas

**4.1. ¿Dónde exactamente van los datos estáticos del empleado?**

**DECISIÓN: Opción A** - Dentro de cfdiData.receiver y cfdiData.payroll.employee
(Nota: Puede cambiar de opinión más adelante)

```typescript
cfdiData: {
  receiver: {
    rfc: "GACJ850101ABC",  // RFC del momento
    name: "Juan García",    // Nombre del momento
  },
  payroll: {
    employee: {
      curp: "GACJ850101HDFXXX",  // CURP del momento
      nss: "12345678901",         // NSS del momento
      // etc.
    }
  }
}
```

---

**4.2. ¿Cuándo se capturan estos datos estáticos?**

**DECISIÓN: Mixto**
- Algunos datos se capturan **al crear el payroll**
- Otros se capturan **al generar el CFDI**
- En particular el **folio** requiere validación, se genera al momento del CFDI

---

**4.3. ¿Los datos estáticos incluyen solo lo necesario para CFDI o más?**

Para CFDI se necesita:
- RFC, CURP, NSS
- Nombre completo
- Fecha de inicio de relación laboral
- Tipo de contrato, régimen, jornada
- Salario base, salario diario
- Banco, cuenta bancaria
- Departamento, puesto

**PENDIENTE:** ¿Solo esto o también otros datos?

---

## 5. Estructura de Earnings y Deductions

### ✅ Respuestas

**5.1. ¿Mantener la estructura actual de earnings/deductions?**

**DECISIÓN:** Mantener la misma estructura pero ajustada al nuevo esquema

Estructura actual (legacy):
```typescript
earnings: {
  halfWeekFixedIncome: 5000,
  commissions: 2000,
  endYearBonus: 3000,
  // ... ~20 campos más
}
```

**NOTA:** La estructura debe ajustarse porque tiene más campos en el nuevo esquema.
**PENDIENTE:** ¿Qué campos nuevos hay que agregar?

---

**5.2. ¿Cómo se relacionan earnings/deductions con cfdiData.perceptions/deductions?**

**PENDIENTE:**
- ¿earnings → se transforma → cfdiData.perceptions al generar CFDI?
- ¿O son completamente independientes?

---

## 6. Flujo de Creación de Payroll

### ❓ Preguntas

**6.1. ¿Qué datos se requieren al crear un payroll?**

```typescript
POST /api/v2/payrolls
{
  collaboratorId: "abc",
  periodStartDate: "2024-01-01",
  periodEndDate: "2024-01-15",

  // ¿Qué más?
  earnings: { ... },
  deductions: { ... },

  // ¿Ya incluir datos para CFDI o después?
}
```

---

**6.2. ¿El payroll se crea en qué status?**
- Pending (requiere aprobación)
- Draft (borrador)
- Otro

---

## 7. Flujo de Generación de CFDI

### ❓ Preguntas

**7.1. ¿Cuándo se puede generar CFDI?**
- Solo si status = Approved
- También si status = Paid
- Otro

---

**7.2. ¿Qué hace el endpoint POST /api/v2/payrolls/:id/generate-cfdi?**

1. Toma datos del colaborador ACTUAL (RFC, CURP, etc.)
2. Los pone en cfdiData
3. Transforma earnings → cfdiData.perceptions
4. Transforma deductions → cfdiData.deductions
5. Guarda el payroll con cfdiData
6. ¿Retorna qué?

---

**7.3. ¿Se puede regenerar el CFDI?**
- No, una vez generado es inmutable
- Sí, se puede regenerar
- Solo si no se ha timbrado

---

## 8. Integración con Facturama

### ❓ Preguntas

**8.1. ¿El endpoint generate-cfdi también llama a Facturama o solo prepara los datos?**

Opción A: Solo prepara cfdiData
```
POST /api/v2/payrolls/:id/generate-cfdi  → Crea cfdiData
POST /api/v2/payrolls/:id/stamp-cfdi     → Llama a Facturama
```

Opción B: Hace todo
```
POST /api/v2/payrolls/:id/generate-cfdi  → Crea cfdiData + llama Facturama
```

---

**8.2. ¿Qué datos de respuesta de Facturama se guardan?**
- UUID del CFDI
- XML
- PDF
- Fecha de timbrado
- Otros

---

## 9. Endpoints de API v2

### ❓ Preguntas

**¿Qué endpoints necesitas en v2?**

Propuesta inicial:
- `POST /api/v2/payrolls` - Crear payroll
- `GET /api/v2/payrolls` - Listar payrolls
- `GET /api/v2/payrolls/:id` - Obtener un payroll
- `PATCH /api/v2/payrolls/:id/approve` - Aprobar payroll
- `POST /api/v2/payrolls/:id/generate-cfdi` - Generar CFDI
- `GET /api/v2/payrolls/:id/cfdi` - Obtener solo el CFDI

¿Faltan o sobran algunos?

---

## 10. Migración y Coexistencia

### ❓ Preguntas

**10.1. ¿Necesitas migrar payrolls existentes a la nueva estructura?**
- No, v1 y v2 coexisten indefinidamente
- Sí, eventualmente migrar todo
- Solo los nuevos usan v2

---

**10.2. ¿Frontend usará v1 o v2?**
- Frontend nuevo usa v2, frontend viejo usa v1
- Todo el frontend migra a v2
- Depende del módulo

---

## Próximos Pasos

1. ✅ Responder todas las preguntas de este documento
2. ⏳ Crear schema final de MongoDB
3. ⏳ Crear modelo, repositorio, mappers
4. ⏳ Crear DTOs y controllers
5. ⏳ Implementar endpoints
6. ⏳ Testing

---

**Notas adicionales:**

(Espacio para cualquier otra decisión o consideración importante)
