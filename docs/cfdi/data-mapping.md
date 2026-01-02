# CFDI Payroll Data Mapping - Facturama Integration

**Fecha:** 2026-01-01
**Propósito:** Mapear los campos del CFDI de nómina (Facturama) con las fuentes de datos en HVP2021 Backend

---

## Estructura de Datos Actual

- **Colaborador (Collaborator):** Datos personales y fiscales del empleado
- **Job:** Información del cargo/posición (veterinario A, B, etc.)
- **Employment:** Condiciones laborales del empleado en un periodo específico (relación empleado-cargo-periodo)
- **Payroll:** Registro de nómina procesada para un periodo
- **Branch:** Sucursal/establecimiento

---

## Mapeo de Campos: CFDI → Fuente de Datos

### 1. Datos Generales del CFDI

| Campo JSON | Descripción | Fuente de Datos | Notas |
|------------|-------------|-----------------|-------|
| `NameId` | ID de configuración de nombre | **Configuración** | Hardcoded o tabla de configuración de empresa |
| `ExpeditionPlace` | Código postal de expedición | **Branch** o **Configuración** | CP de la sucursal principal |
| `CfdiType` | Tipo de CFDI (N=Nómina) | **Constante** | Siempre "N" para nómina |
| `PaymentMethod` | Método de pago (PUE=Pago en una sola exhibición) | **Configuración** | Siempre "PUE" para nómina |
| `Folio` | Número de folio | **Payroll** | Generar secuencial o usar ID de Payroll |

### 2. Receiver (Receptor - Empleado)

| Campo JSON | Descripción | Fuente de Datos | Campo en Modelo |
|------------|-------------|-----------------|-----------------|
| `Receiver.Rfc` | RFC del empleado | **Colaborador** | `collaborator.rfc` |
| `Receiver.Name` | Nombre completo | **Colaborador** | `collaborator.fullName` o concatenar nombre |
| `Receiver.CfdiUse` | Uso del CFDI | **Constante** | "CN01" (Nómina) |
| `Receiver.FiscalRegime` | Régimen fiscal | **Colaborador** | `collaborator.fiscalRegime` *(campo a crear)* |
| `Receiver.TaxZipCode` | CP fiscal del empleado | **Colaborador** | `collaborator.taxZipCode` *(campo a crear)* |

**Campos faltantes en Colaborador:**
- ✅ `rfc` (ya existe)
- ❌ `fiscalRegime` (crear - default: "605" - Sueldos y salarios)
- ❌ `taxZipCode` (crear - obtener de dirección o input)

---

### 3. Issuer (Emisor - Empresa)

| Campo JSON | Descripción | Fuente de Datos | Notas |
|------------|-------------|-----------------|-------|
| `Complemento.Payroll.Issuer.EmployerRegistration` | Registro patronal IMSS | **Configuración** | "B5510768108" - Dato fijo de la empresa en config |

---

### 4. Payroll General Data (Datos de la Nómina)

| Campo JSON | Descripción | Fuente de Datos | Campo en Modelo |
|------------|-------------|-----------------|-----------------|
| `Complemento.Payroll.Type` | Tipo de nómina (O=Ordinaria, E=Extraordinaria) | **Payroll** | `payroll.type` *(nuevo campo o default "O")* |
| `Complemento.Payroll.PaymentDate` | Fecha de pago | **Payroll** | `payroll.paymentDate` |
| `Complemento.Payroll.InitialPaymentDate` | Inicio del periodo | **Payroll** | `payroll.periodStartDate` |
| `Complemento.Payroll.FinalPaymentDate` | Fin del periodo | **Payroll** | `payroll.periodEndDate` |
| `Complemento.Payroll.DaysPaid` | Días pagados | **Payroll** | Calcular: días trabajados en el periodo |

---

### 5. Employee (Datos del Empleado en Nómina)

| Campo JSON | Descripción | Fuente de Datos | Campo/Cálculo |
|------------|-------------|-----------------|---------------|
| `Employee.Curp` | CURP del empleado | **Colaborador** | `collaborator.curp` *(crear)* |
| `Employee.SocialSecurityNumber` | NSS (Número de Seguro Social) | **Colaborador** | `collaborator.nss` *(crear)* |
| `Employee.StartDateLaborRelations` | Fecha de inicio de relación laboral | **Colaborador** | `collaborator.startDateLaborRelations` *(crear)* |
| `Employee.ContractType` | Tipo de contrato | **Colaborador** | `collaborator.contractType` *(crear: "01"=Permanente, "02"=Temporal)* |
| `Employee.RegimeType` | Tipo de régimen | **Colaborador** | `collaborator.regimeType` *(crear: "02"=Sueldos y salarios)* |
| `Employee.Unionized` | ¿Sindicalizado? | **N/A - Opcional** | Siempre `false` - No se registra en HVP |
| `Employee.TypeOfJourney` | Tipo de jornada | **Employment** | `employment.journeyType` *(crear: "01"=Diurna, "02"=Nocturna)* |
| `Employee.EmployeeNumber` | Número de empleado | **Colaborador** | `collaborator.employeeNumber` *(crear)* |
| `Employee.Department` | Departamento | **N/A - Opcional** | Omitir - No se registra en HVP |
| `Employee.Position` | Puesto/Cargo | **Job** | `job.title` |
| `Employee.PositionRisk` | Riesgo del puesto | **Constante** | Siempre `"1"` (Clase I - mínimo riesgo) |
| `Employee.FrequencyPayment` | Frecuencia de pago | **Employment** | `employment.paymentFrequency` *(crear enum: "04"=Quincenal)* |
| `Employee.Bank` | Banco | **Colaborador** | `collaborator.bank` *(crear)* |
| `Employee.BankAccount` | Cuenta bancaria | **Colaborador** | `collaborator.bankAccount` *(crear)* |
| `Employee.BaseSalary` | Salario base de cotización | **Employment** | `employment.baseSalary` o calcular |
| `Employee.DailySalary` | Salario diario integrado | **Employment** | `employment.dailySalary` o calcular |
| `Employee.FederalEntityKey` | Clave de entidad federativa | **CompanySettings** | `companySettings.federalEntityKey` ("YUC") |

**Campos faltantes críticos:**

**En Colaborador:**
- ❌ `curp` (CURP)
- ❌ `nss` (Número de Seguro Social)
- ❌ `employeeNumber` (Número de empleado único)
- ❌ `startDateLaborRelations` (Fecha inicio relación laboral)
- ❌ `contractType` (Tipo de contrato: "01", "02", etc.)
- ❌ `regimeType` (Régimen: "02"=Sueldos y salarios)
- ❌ `bank` (Banco)
- ❌ `bankAccount` (Cuenta bancaria)

**En Employment:**
- ❌ `journeyType` (Tipo de jornada: "01"=Diurna)
- ❌ `paymentFrequency` (Frecuencia: "04"=Quincenal)

**Campos opcionales (no aplican a HVP):**
- ⚪ `Employee.Unionized` - Siempre false
- ⚪ `Employee.Department` - Omitir
- ⚪ `Employee.PositionRisk` - Siempre "1"

---

### 6. Perceptions (Percepciones)

| Campo JSON | Descripción | Fuente de Datos | Notas |
|------------|-------------|-----------------|-------|
| `Perceptions.Details[]` | Array de percepciones | **Payroll.perceptions** | Mapear cada tipo de percepción |
| `PerceptionType` | Código SAT de percepción | **Configuración/Catálogo** | "001"=Sueldos, salarios, etc. |
| `Code` | Código interno | **Propio** | "SDI", "AGUINALDO", etc. |
| `Description` | Descripción | **Catálogo** | "Salario Diario", "Aguinaldo", etc. |
| `TaxedAmount` | Monto gravado | **Payroll.perceptions** | Calcular según tipo |
| `ExemptAmount` | Monto exento | **Payroll.perceptions** | Calcular según tipo y límites UMA |

**Mapeo de percepciones comunes:**
- Salario ordinario → `001` (Sueldos, salarios, rayas y jornales)
- Aguinaldo → `002` (Gratificación anual - aguinaldo)
- Prima vacacional → `021` (Prima vacacional)
- Horas extra → `019` (Horas extra)
- Prima dominical → `020` (Prima dominical)

---

### 7. Deductions (Deducciones)

| Campo JSON | Descripción | Fuente de Datos | Notas |
|------------|-------------|-----------------|-------|
| `Deductions.Details[]` | Array de deducciones | **Payroll.deductions** | Mapear cada tipo de deducción |
| `DeduccionType` | Código SAT de deducción | **Configuración/Catálogo** | "001"=IMSS, "002"=ISR |
| `Code` | Código interno | **Propio** | "IMSS", "ISR", etc. |
| `Description` | Descripción | **Catálogo** | "Seguridad Social", etc. |
| `Amount` | Monto deducido | **Payroll.deductions** | Calcular según tipo |

**Mapeo de deducciones comunes:**
- IMSS → `001` (Seguridad social)
- ISR → `002` (ISR)
- Préstamos → `006` (Descuento por incapacidad)
- Faltas/Inasistencias → `007` (Pensión alimenticia)

---

### 8. Other Payments (Otros Pagos)

| Campo JSON | Descripción | Fuente de Datos | Notas |
|------------|-------------|-----------------|-------|
| `OtherPayments[]` | Otros pagos (subsidio empleo, etc.) | **Payroll** | Subsidio para el empleo |
| `OtherPaymentType` | Tipo de otro pago | **Catálogo** | "002"=Subsidio para el empleo |
| `Amount` | Monto | **Payroll** | Calcular según tabla SAT |

---

## Resumen de Cambios Necesarios

### ✅ Modelo: Collaborator (Colaborador)

**Campos a agregar:**
```typescript
{
  // Identificación
  employeeNumber: string;           // Número de empleado único
  curp: string;                     // CURP
  nss: string;                      // Número de Seguro Social
  rfc: string;                      // ✅ Ya existe

  // Datos fiscales
  fiscalRegime: string;             // Régimen fiscal (default: "605" - Sueldos y salarios)
  taxZipCode: string;               // Código postal fiscal

  // Relación laboral
  startDateLaborRelations: Date;    // Fecha de inicio de relación laboral
  contractType: string;             // "01"=Permanente, "02"=Temporal, etc.
  regimeType: string;               // "02"=Sueldos y salarios

  // Datos bancarios
  bank: string;                     // Banco (SANTANDER, BBVA, etc.)
  bankAccount: string;              // Número de cuenta bancaria
}
```

### ✅ Modelo: Employment (Empleo)

**Campos a agregar:**
```typescript
{
  journeyType: string;              // "01"=Diurna, "02"=Nocturna, "03"=Mixta, etc.
  paymentFrequency: string;         // "04"=Quincenal (según HVP)
  baseSalary: number;               // Salario base de cotización (puede calcularse)
  dailySalary: number;              // Salario diario integrado (puede calcularse)
}
```

### ✅ Modelo: Job (Cargo)

**No requiere cambios** - Los datos necesarios ya existen:
- `job.title` → Position
- `job.department` (opcional, no se usa en HVP)

### ✅ Modelo: Payroll (Nómina)

**Campos a agregar:**
```typescript
{
  type: string;                     // "O"=Ordinaria, "E"=Extraordinaria
  folio?: string;                   // Folio del CFDI
  cfdiUuid?: string;                // UUID del CFDI timbrado
}
```

### ✅ Nuevo Modelo: CompanySettings (Singleton)

**Crear nueva colección en base de datos:**
```typescript
{
  _id: ObjectId,
  name: string;                         // "Hospital Veterinario Peninsular"
  rfc: string;                          // RFC de la empresa
  employerRegistration: string;         // Registro patronal IMSS "B5510768108"
  expeditionZipCode: string;            // CP de expedición del CFDI
  federalEntityKey: string;             // "YUC" para Yucatán
  fiscalAddress?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
```

**Variables de entorno (.env)** - Solo secrets:
```bash
# Facturama API (secrets)
FACTURAMA_API_KEY=your-api-key
FACTURAMA_API_SECRET=your-api-secret
FACTURAMA_SANDBOX=true
FACTURAMA_NAME_ID=1
```

---

## Catálogos SAT Necesarios

Para completar la integración, necesitas implementar/consultar estos catálogos del SAT:

1. **c_TipoContrato** - Tipos de contrato
2. **c_TipoRegimen** - Tipos de régimen
3. **c_TipoJornada** - Tipos de jornada
4. **c_PeriodicidadPago** - Frecuencia de pago
5. **c_TipoPercepcion** - Tipos de percepción
6. **c_TipoDeduccion** - Tipos de deducción
7. **c_TipoOtroPago** - Tipos de otro pago
8. **c_RiesgoPuesto** - Riesgo del puesto
9. **c_Estado** - Entidades federativas

Referencia: http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI.xls

---

## Próximos Pasos

### 1. Migración de Base de Datos

**Collaborator (8 campos nuevos):**
- `employeeNumber`, `curp`, `nss`
- `startDateLaborRelations`, `contractType`, `regimeType`
- `fiscalRegime`, `taxZipCode`
- `bank`, `bankAccount`

**Employment (2 campos nuevos):**
- `journeyType` (enum)
- `paymentFrequency` (enum)

**Payroll (3 campos nuevos):**
- `type` ("O"=Ordinaria, "E"=Extraordinaria)
- `folio` (opcional)
- `cfdiUuid` (opcional)

**CompanySettings (modelo nuevo - singleton):**
- Crear colección con datos de HVP
- Seed inicial con datos de la empresa

### 2. Configuración de Facturama

**Agregar a .env:**
```bash
FACTURAMA_API_KEY=your-key
FACTURAMA_API_SECRET=your-secret
FACTURAMA_SANDBOX=true
FACTURAMA_NAME_ID=1
```

### 3. Validación de Datos Existentes

- Verificar colaboradores tengan CURP, NSS, RFC válidos
- Asignar `employeeNumber` a colaboradores existentes
- Asignar valores default a `contractType`, `regimeType`
- Revisar datos bancarios

### 4. Implementación de Mappers

- Service/factory para transformar `Payroll` → CFDI JSON de Facturama
- Implementar catálogos SAT (tipos de contrato, régimen, jornada, etc.)
- Validaciones de estructura según especificación SAT

### 5. Testing

- Probar con datos reales de un empleado
- Validar JSON contra schema de Facturama
- Pruebas en ambiente sandbox de Facturama
- Verificar timbrado exitoso

---

## Resumen Visual de Distribución de Datos

```
CFDI de Nómina (Facturama)
│
├─ Receiver (Empleado fiscal)
│  └─ Colaborador: rfc, name, fiscalRegime, taxZipCode
│
├─ Issuer (Empresa)
│  └─ CompanySettings: employerRegistration
│
├─ Payroll General
│  └─ Payroll: type, paymentDate, periodStartDate, periodEndDate
│
├─ Employee (Datos laborales del empleado)
│  ├─ Colaborador:
│  │  ├─ Identificación: curp, nss, employeeNumber
│  │  ├─ Relación laboral: startDateLaborRelations, contractType, regimeType
│  │  └─ Datos bancarios: bank, bankAccount
│  │
│  ├─ Employment:
│  │  ├─ Jornada y pago: journeyType, paymentFrequency
│  │  └─ Salarios: baseSalary, dailySalary
│  │
│  ├─ Job:
│  │  └─ Puesto: title (→ Position)
│  │
│  ├─ CompanySettings:
│  │  └─ Entidad: federalEntityKey
│  │
│  └─ Constantes/Opcionales:
│     ├─ unionized: false (siempre)
│     ├─ department: omitir
│     └─ positionRisk: "1" (siempre)
│
├─ Perceptions (Percepciones)
│  └─ Payroll.perceptions: tipo, monto gravado, monto exento
│
├─ Deductions (Deducciones)
│  └─ Payroll.deductions: tipo, monto
│
└─ Other Payments
   └─ Payroll: subsidio para el empleo
```

**Leyenda de cambios:**
- ✅ **Ya existe en DB**
- ❌ **Falta crear**
- ⚪ **Opcional/Constante (no guardar)**

