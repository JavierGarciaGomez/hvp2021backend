# SAT Catalogs Reference - CFDI Payroll

**Date:** 20260102
**Purpose:** Document all SAT catalog codes needed for CFDI payroll implementation
**Reference:** http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI.xls

---

## Table of Contents

1. [Perception Types (c_TipoPercepcion)](#perception-types)
2. [Deduction Types (c_TipoDeduccion)](#deduction-types)
3. [Other Payment Types (c_TipoOtroPago)](#other-payment-types)
4. [Contract Types (c_TipoContrato)](#contract-types)
5. [Regime Types (c_TipoRegimen)](#regime-types)
6. [Journey Types (c_TipoJornada)](#journey-types)
7. [Payment Frequencies (c_PeriodicidadPago)](#payment-frequencies)
8. [Position Risk (c_RiesgoPuesto)](#position-risk)
9. [Federal Entities (c_Estado)](#federal-entities)
10. [CFDI Use (c_UsoCFDI)](#cfdi-use)
11. [Fiscal Regimes (c_RegimenFiscal)](#fiscal-regimes)

---

## Perception Types (c_TipoPercepcion)

**Catalog:** c_TipoPercepcion
**Used for:** Employee perceptions (income)

### Common Codes for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 001 | Sueldos, Salarios, Rayas y Jornales | ✅ Yes - Base salary |
| 002 | Gratificación Anual (Aguinaldo) | ✅ Yes - Year-end bonus |
| 019 | Horas Extra | ✅ Yes - Overtime |
| 020 | Prima Dominical | ✅ Yes - Sunday bonus |
| 021 | Prima Vacacional | ✅ Yes - Vacation bonus |
| 022 | Prima por Antigüedad | ⚪ Maybe - Seniority bonus |
| 025 | Indemnizaciones | ⚪ Maybe - Severance |
| 028 | Subsidio para el empleo (efectivamente entregado al trabajador) | ❌ No - Goes to OtherPayments |
| 038 | Viáticos | ⚪ Maybe - Travel expenses |
| 045 | Jubilaciones, pensiones o haberes de retiro en una sola exhibición | ⚪ Maybe - PTU |
| 050 | Premios por asistencia | ✅ Yes - Attendance bonuses |

### All Perception Types:

```typescript
export const SAT_PERCEPTION_TYPES = {
  // Ordinary
  '001': 'Sueldos, Salarios, Rayas y Jornales',
  '002': 'Gratificación Anual (Aguinaldo)',
  '003': 'Participación de los Trabajadores en las Utilidades (PTU)',
  '004': 'Reembolso de Gastos Médicos Dentales y Hospitalarios',
  '005': 'Fondo de Ahorro',
  '006': 'Caja de ahorro',
  '009': 'Contribuciones a Cargo del Trabajador Pagadas por el Patrón',
  '010': 'Premios por puntualidad',
  '011': 'Prima de Seguro de vida',
  '012': 'Seguro de Gastos Médicos Mayores',
  '013': 'Cuotas Sindicales Pagadas por el Patrón',
  '014': 'Subsidios por incapacidad',
  '015': 'Becas para trabajadores y/o hijos',
  '019': 'Horas extra',
  '020': 'Prima dominical',
  '021': 'Prima vacacional',
  '022': 'Prima por antigüedad',
  '023': 'Pagos por separación',
  '024': 'Seguro de retiro',
  '025': 'Indemnizaciones',
  '026': 'Reembolso por funeral',
  '028': 'Subsidio para el empleo (efectivamente entregado al trabajador)',
  '029': 'Subsidio para el empleo (efectivamente entregado al trabajador)',
  '030': 'Aplicación de saldo a favor por compensación anual',
  '031': 'Reembolso de descuentos efectuados a sueldos y salarios',
  '032': 'Percepción por primas de seguros de retiro',
  '038': 'Viáticos',
  '039': 'Otros',
  '044': 'Jubilaciones, pensiones o haberes de retiro en parcialidades',
  '045': 'Jubilaciones, pensiones o haberes de retiro en una sola exhibición',
  '046': 'Ingresos en acciones o títulos valor',
  '047': 'Alimentación',
  '048': 'Habitación',
  '049': 'Premios por asistencia',
  '050': 'Vales de despensa',
  // ... (SAT has many more)
} as const;
```

---

## Deduction Types (c_TipoDeduccion)

**Catalog:** c_TipoDeduccion
**Used for:** Employee deductions

### Common Codes for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 001 | Seguridad Social | ✅ Yes - IMSS |
| 002 | ISR | ✅ Yes - Income tax |
| 003 | Aportaciones a retiro, cesantía en edad avanzada y vejez | ⚪ Maybe - Retirement |
| 004 | Otros | ✅ Yes - Other deductions |
| 005 | Aportaciones a Fondo de vivienda | ⚪ Maybe - Housing |
| 006 | Descuento por incapacidad | ⚪ Maybe - Disability discount |
| 007 | Pensión alimenticia | ⚪ Maybe - Alimony |
| 019 | Descuentos por inasistencias | ✅ Yes - Absence deductions |

### All Deduction Types:

```typescript
export const SAT_DEDUCTION_TYPES = {
  '001': 'Seguridad Social',
  '002': 'ISR',
  '003': 'Aportaciones a retiro, cesantía en edad avanzada y vejez',
  '004': 'Otros',
  '005': 'Aportaciones a Fondo de vivienda',
  '006': 'Descuento por incapacidad',
  '007': 'Pensión alimenticia',
  '008': 'Renta',
  '009': 'Préstamos provenientes del Fondo Nacional de la Vivienda para los Trabajadores',
  '010': 'Pago por crédito de vivienda',
  '011': 'Pago de abonos INFONACOT',
  '012': 'Anticipo de salarios',
  '013': 'Pagos hechos con exceso al trabajador',
  '014': 'Errores',
  '015': 'Pérdidas',
  '016': 'Averías',
  '017': 'Adquisición de artículos producidos por la empresa o establecimiento',
  '018': 'Cuotas para la constitución y fomento de sociedades cooperativas y de cajas de ahorro',
  '019': 'Cuotas sindicales',
  '020': 'Ausencias (Ausentismo)',
  '021': 'Cuotas obrero patronales',
  '022': 'Impuestos Locales',
  '023': 'Aportaciones voluntarias',
  '024': 'Ajuste en Gratificación Anual (Aguinaldo) Exento',
  '025': 'Ajuste en Gratificación Anual (Aguinaldo) Gravado',
  // ... more
} as const;
```

---

## Other Payment Types (c_TipoOtroPago)

**Catalog:** c_TipoOtroPago
**Used for:** Other payments (subsidies, etc.)

### Common Codes for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 002 | Subsidio para el empleo (efectivamente entregado al trabajador) | ✅ Yes - Employment subsidy |
| 999 | Pagos distintos a los listados | ⚪ Maybe - Other payments |

### All Other Payment Types:

```typescript
export const SAT_OTHER_PAYMENT_TYPES = {
  '001': 'Reintegro de ISR pagado en exceso (siempre que no haya sido enterado al SAT)',
  '002': 'Subsidio para el empleo (efectivamente entregado al trabajador)',
  '003': 'Viáticos (entregados al trabajador)',
  '004': 'Aplicación de saldo a favor por compensación anual',
  '005': 'Reintegro de ISR retenido en exceso de ejercicio anterior',
  '999': 'Pagos distintos a los listados y que no deben considerarse como ingreso por sueldos, salarios o ingresos asimilados',
} as const;
```

---

## Contract Types (c_TipoContrato)

**Catalog:** c_TipoContrato
**Used for:** Employee contract type

### Codes for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 01 | Contrato de trabajo por tiempo indeterminado | ✅ Yes - Permanent |
| 02 | Contrato de trabajo para obra determinada | ⚪ Maybe - Temporary |
| 03 | Contrato de trabajo por tiempo determinado | ⚪ Maybe - Fixed term |
| 04 | Contrato de trabajo por temporada | ❌ No |
| 05 | Contrato de trabajo sujeto a prueba | ⚪ Maybe - Trial period |
| 06 | Contrato de trabajo con capacitación inicial | ❌ No |
| 99 | Otro contrato | ⚪ Maybe |

### Implementation:

```typescript
export enum ContractType {
  Permanent = '01',           // Por tiempo indeterminado
  SpecificWork = '02',        // Obra determinada
  FixedTerm = '03',           // Tiempo determinado
  Seasonal = '04',            // Por temporada
  Trial = '05',               // Sujeto a prueba
  Training = '06',            // Con capacitación inicial
  Other = '99'                // Otro
}

// Default for HVP: '01' (Permanent)
```

---

## Regime Types (c_TipoRegimen)

**Catalog:** c_TipoRegimen
**Used for:** Employee labor regime

### Codes for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 02 | Sueldos (Incluye ingresos señalados en la fracción I del artículo 94 de LISR) | ✅ Yes - Salaries |
| 03 | Jubilados | ❌ No |
| 04 | Pensionados | ❌ No |
| 05 | Asimilados Miembros Sociedades Cooperativas Produccion | ❌ No |
| 09 | Asimilados Integrantes Sociedades Asociaciones Civiles | ❌ No |
| 99 | Otro Régimen | ❌ No |

### Implementation:

```typescript
export enum RegimeType {
  Salaries = '02',            // Sueldos
  Retired = '03',             // Jubilados
  Pensioners = '04',          // Pensionados
  CooperativeMembers = '05',  // Miembros sociedades cooperativas
  CivilAssociations = '09',   // Asociaciones civiles
  Other = '99'                // Otro
}

// Default for HVP: '02' (Salaries)
```

---

## Journey Types (c_TipoJornada)

**Catalog:** c_TipoJornada
**Used for:** Work shift type

### Codes for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 01 | Diurna | ✅ Yes - Day shift |
| 02 | Nocturna | ⚪ Maybe - Night shift |
| 03 | Mixta | ⚪ Maybe - Mixed shift |
| 04 | Por hora | ❌ No |
| 05 | Reducida | ❌ No |
| 06 | Continuada | ❌ No |
| 07 | Partida | ❌ No |
| 08 | Por turnos | ❌ No |
| 99 | Otra jornada | ❌ No |

### Implementation:

```typescript
export enum JourneyType {
  Day = '01',        // Diurna
  Night = '02',      // Nocturna
  Mixed = '03',      // Mixta
  ByHour = '04',     // Por hora
  Reduced = '05',    // Reducida
  Continuous = '06', // Continuada
  Split = '07',      // Partida
  Shifts = '08',     // Por turnos
  Other = '99'       // Otra
}

// Default for HVP: '01' (Day)
```

---

## Payment Frequencies (c_PeriodicidadPago)

**Catalog:** c_PeriodicidadPago
**Used for:** How often employee is paid

### Codes for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 01 | Diario | ❌ No |
| 02 | Semanal | ❌ No |
| 03 | Catorcenal | ❌ No |
| 04 | Quincenal | ✅ Yes - Biweekly |
| 05 | Mensual | ⚪ Maybe |
| 06 | Bimestral | ❌ No |
| 07 | Unidad obra | ❌ No |
| 08 | Comisión | ❌ No |
| 09 | Precio alzado | ❌ No |
| 10 | Decenal | ❌ No |
| 99 | Otra periodicidad | ❌ No |

### Implementation:

```typescript
export enum PaymentFrequency {
  Daily = '01',        // Diario
  Weekly = '02',       // Semanal
  Fortnightly = '03',  // Catorcenal
  Biweekly = '04',     // Quincenal
  Monthly = '05',      // Mensual
  Bimonthly = '06',    // Bimestral
  ByWork = '07',       // Unidad obra
  Commission = '08',   // Comisión
  FixedPrice = '09',   // Precio alzado
  TenDays = '10',      // Decenal
  Other = '99'         // Otra
}

// Default for HVP: '04' (Biweekly)
```

---

## Position Risk (c_RiesgoPuesto)

**Catalog:** c_RiesgoPuesto
**Used for:** Occupational risk level

### Codes:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 1 | Clase I | ✅ Yes - Minimum risk |
| 2 | Clase II | ❌ No |
| 3 | Clase III | ❌ No |
| 4 | Clase IV | ❌ No |
| 5 | Clase V | ❌ No |

### Implementation:

```typescript
export enum PositionRisk {
  ClassI = '1',    // Mínimo riesgo
  ClassII = '2',
  ClassIII = '3',
  ClassIV = '4',
  ClassV = '5'     // Máximo riesgo
}

// Default for HVP: '1' (Class I - Minimum risk)
// Note: This is a constant, not a field
```

---

## Federal Entities (c_Estado)

**Catalog:** c_Estado
**Used for:** Mexican states

### Code for HVP:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| YUC | Yucatán | ✅ Yes |

### Common Codes:

```typescript
export const FEDERAL_ENTITIES = {
  'AGU': 'Aguascalientes',
  'BCN': 'Baja California',
  'BCS': 'Baja California Sur',
  'CAM': 'Campeche',
  'CHP': 'Chiapas',
  'CHH': 'Chihuahua',
  'COA': 'Coahuila de Zaragoza',
  'COL': 'Colima',
  'CMX': 'Ciudad de México',
  'DUR': 'Durango',
  'GUA': 'Guanajuato',
  'GRO': 'Guerrero',
  'HID': 'Hidalgo',
  'JAL': 'Jalisco',
  'MEX': 'México',
  'MIC': 'Michoacán de Ocampo',
  'MOR': 'Morelos',
  'NAY': 'Nayarit',
  'NLE': 'Nuevo León',
  'OAX': 'Oaxaca',
  'PUE': 'Puebla',
  'QUE': 'Querétaro',
  'ROO': 'Quintana Roo',
  'SLP': 'San Luis Potosí',
  'SIN': 'Sinaloa',
  'SON': 'Sonora',
  'TAB': 'Tabasco',
  'TAM': 'Tamaulipas',
  'TLA': 'Tlaxcala',
  'VER': 'Veracruz de Ignacio de la Llave',
  'YUC': 'Yucatán',
  'ZAC': 'Zacatecas'
} as const;

// HVP uses: 'YUC'
```

---

## CFDI Use (c_UsoCFDI)

**Catalog:** c_UsoCFDI
**Used for:** Purpose of the CFDI

### Code for Payroll:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| CN01 | Nómina | ✅ Yes - Payroll |

### Implementation:

```typescript
export enum CfdiUse {
  Payroll = 'CN01'  // Always CN01 for payroll CFDI
}

// HVP uses: 'CN01' (always for payroll)
```

---

## Fiscal Regimes (c_RegimenFiscal)

**Catalog:** c_RegimenFiscal
**Used for:** Fiscal regime of receiver (employee)

### Code for Employees:

| Code | Description | Used in HVP |
|------|-------------|-------------|
| 605 | Sueldos y Salarios e Ingresos Asimilados a Salarios | ✅ Yes |

### Common Codes:

```typescript
export const FISCAL_REGIMES = {
  '601': 'General de Ley Personas Morales',
  '603': 'Personas Morales con Fines no Lucrativos',
  '605': 'Sueldos y Salarios e Ingresos Asimilados a Salarios',
  '606': 'Arrendamiento',
  '607': 'Régimen de Enajenación o Adquisición de Bienes',
  '608': 'Demás ingresos',
  '610': 'Residentes en el Extranjero sin Establecimiento Permanente en México',
  '611': 'Ingresos por Dividendos (socios y accionistas)',
  '612': 'Personas Físicas con Actividades Empresariales y Profesionales',
  '614': 'Ingresos por intereses',
  '615': 'Régimen de los ingresos por obtención de premios',
  '616': 'Sin obligaciones fiscales',
  '620': 'Sociedades Cooperativas de Producción que optan por diferir sus ingresos',
  '621': 'Incorporación Fiscal',
  '622': 'Actividades Agrícolas, Ganaderas, Silvícolas y Pesqueras',
  '623': 'Opcional para Grupos de Sociedades',
  '624': 'Coordinados',
  '625': 'Régimen de las Actividades Empresariales con ingresos a través de Plataformas Tecnológicas',
  '626': 'Régimen Simplificado de Confianza',
} as const;

// HVP employees use: '605' (Salaries)
```

---

## Validation Rules

### Required Fields by Catalog:

1. **Perceptions:**
   - Must have valid `perceptionType` from c_TipoPercepcion
   - Must have `taxedAmount` OR `exemptAmount` (can have both)
   - `totalAmount` = `taxedAmount` + `exemptAmount`

2. **Deductions:**
   - Must have valid `deductionType` from c_TipoDeduccion
   - Must have `amount` > 0

3. **Other Payments:**
   - Must have valid `otherPaymentType` from c_TipoOtroPago
   - If type = '002' (Subsidio empleo), must include `employmentSubsidy` object

4. **Employee:**
   - `contractType` must be valid from c_TipoContrato
   - `regimeType` must be valid from c_TipoRegimen
   - `journeyType` must be valid from c_TipoJornada
   - `paymentFrequency` must be valid from c_PeriodicidadPago
   - `positionRisk` must be valid from c_RiesgoPuesto (always '1' for HVP)

---

## Implementation Strategy

### 1. Constants File

Create a constants file with all catalog values:

```typescript
// src/domain/constants/sat-catalogs.constants.ts
export const SAT_CATALOGS = {
  perceptionTypes: { /* ... */ },
  deductionTypes: { /* ... */ },
  otherPaymentTypes: { /* ... */ },
  contractTypes: { /* ... */ },
  regimeTypes: { /* ... */ },
  journeyTypes: { /* ... */ },
  paymentFrequencies: { /* ... */ },
  positionRisks: { /* ... */ },
  federalEntities: { /* ... */ },
  cfdiUses: { /* ... */ },
  fiscalRegimes: { /* ... */ }
};
```

### 2. Validation Service

Create a service to validate SAT codes:

```typescript
// src/domain/services/sat-catalog.service.ts
export class SATCatalogService {
  validatePerceptionType(code: string): boolean {
    return code in SAT_CATALOGS.perceptionTypes;
  }

  getPerceptionDescription(code: string): string {
    return SAT_CATALOGS.perceptionTypes[code] || 'Unknown';
  }

  // ... similar for other catalogs
}
```

### 3. Default Values for HVP

```typescript
// src/domain/constants/hvp-defaults.constants.ts
export const HVP_DEFAULTS = {
  contractType: '01',           // Permanent
  regimeType: '02',             // Salaries
  journeyType: '01',            // Day
  paymentFrequency: '04',       // Biweekly
  positionRisk: '1',            // Class I
  federalEntityKey: 'YUC',      // Yucatán
  cfdiUse: 'CN01',              // Payroll
  fiscalRegime: '605',          // Salaries and wages
  unionized: false,             // Not unionized
  paymentMethod: 'PUE',         // Single payment
  cfdiType: 'N'                 // Payroll
};
```

---

## Testing Strategy

### Unit Tests

```typescript
describe('SATCatalogService', () => {
  it('should validate perception type codes', () => {
    expect(service.validatePerceptionType('001')).toBe(true);
    expect(service.validatePerceptionType('999')).toBe(false);
  });

  it('should get perception description', () => {
    expect(service.getPerceptionDescription('001'))
      .toBe('Sueldos, Salarios, Rayas y Jornales');
  });
});
```

---

## References

- **Official SAT Catalog:** http://omawww.sat.gob.mx/tramitesyservicios/Paginas/documentos/catCFDI.xls
- **Facturama Docs:** https://www.facturama.mx/api/
- **CFDI 4.0 Specification:** https://www.sat.gob.mx/consultas/92764/comprobante-fiscal-digital-por-internet-(cfdi)

---

**Last updated:** 20260102
