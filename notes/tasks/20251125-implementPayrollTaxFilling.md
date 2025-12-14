# Payroll Tax Filing Implementation - 2025-11-25

## Project Overview
Implementation of Mexican payroll tax filing (CFDI Nómina) integration with Facturama API for HVP2021 backend system.

## Related Documentation
- [Facturama Integration Research](../facturama-integration-research.md)
- [Facturama API Documentation](https://apisandbox.facturama.mx/guias/nominas/sueldo)

---

## Pending Tasks

### 1. Payload Development & Mapping
- [ ] **Trabajar en el payload**
  - [ ] Definir estructura completa del FacturamaPayrollRequest
  - [ ] Crear tipos TypeScript para el payload
  - [ ] Implementar builder/factory pattern para construcción del payload
  - [ ] Validar todos los campos requeridos del payload
  - [ ] Agregar tests unitarios para generación del payload

- [ ] **Hacer una tabla comparando el payload**
  - [ ] Comparar estructura actual vs estructura requerida por Facturama
  - [ ] Identificar transformaciones necesarias
  - [ ] Documentar diferencias críticas
  - [ ] Crear mapping configuration
  - [ ] Validar completeness del mapping

### 2. Tax Exemption Analysis
- [ ] **Analizar lo que está exento en la nomina**
  - [ ] Investigar reglas SAT para percepciones exentas
  - [ ] Documentar límites de UMA por tipo de percepción
    - [ ] Horas extra (9 hrs semanales exentas)
    - [ ] Prima dominical (1 UMA por domingo)
    - [ ] Prima vacacional (15 UMA anuales)
    - [ ] Aguinaldo (30 UMA anuales)
    - [ ] Alimentación (reglas específicas)
  - [ ] Crear tabla de referencia de montos exentos
  - [ ] Implementar servicio de cálculo de UMA actualizado

- [ ] **Mejorar la lógica para incluir por cada concepto exempt y no exempt**
  - [ ] Crear PayrollTaxCalculator service
    - [ ] `splitOvertimeHours(amount, hours): { taxedAmount, exemptAmount }`
    - [ ] `splitSundayBonus(amount): { taxedAmount, exemptAmount }`
    - [ ] `splitVacationBonus(amount, annualAccumulated): { taxedAmount, exemptAmount }`
    - [ ] `splitEndYearBonus(amount, annualAccumulated): { taxedAmount, exemptAmount }`
    - [ ] `splitMealCompensation(amount): { taxedAmount, exemptAmount }`
    - [ ] `splitProfitSharing(amount): { taxedAmount, exemptAmount }`
  - [ ] Agregar tracking de montos anuales acumulados por empleado
  - [ ] Implementar validación de límites anuales
  - [ ] Crear tests para cada tipo de split
  - [ ] Documentar fórmulas y reglas aplicadas

### 3. Data Completeness & Schema Updates
- [ ] **Datos faltantes del payload**
  - [ ] Identificar campos faltantes en Employee entity
    - [ ] CURP (18 caracteres)
    - [ ] RFC (12-13 caracteres)
    - [ ] Fiscal regime (régimen fiscal)
    - [ ] Tax zip code (código postal fiscal)
    - [ ] Bank name (optional)
    - [ ] Bank account/CLABE (optional)
    - [ ] Unionized status (sindicalizado)
  - [ ] Identificar campos faltantes en Employment entity
    - [ ] Start date labor relations (fecha inicio relación laboral)
    - [ ] Contract type (tipo de contrato SAT)
    - [ ] Type of journey (tipo de jornada SAT)
    - [ ] Federal entity key (estado donde presta servicios)
  - [ ] Identificar campos faltantes en Company/Branch entity
    - [ ] Expedition place (código postal de expedición)
    - [ ] Employer registration (registro patronal)
  - [ ] Identificar campos faltantes en Job entity
    - [ ] Position risk (riesgo de puesto)
    - [ ] Department (departamento)
  - [ ] Crear migrations para nuevos campos
  - [ ] Actualizar DTOs y validaciones
  - [ ] Crear scripts de backfill para datos existentes

- [ ] **Forma de pago**
  - [ ] Investigar formas de pago SAT (catálogo c_FormaPago)
  - [ ] Determinar mapeo desde PaymentType actual
  - [ ] Implementar lógica de selección automática
  - [ ] Agregar configuración por empleado si es necesario
  - [ ] Validar contra catálogo SAT actualizado

### 4. Business Logic & Calculations
- [ ] **Averiguar bien sobre el paquete**
  - [ ] Investigar concepto de "paquete" en contexto de nómina
  - [ ] Determinar si aplica a nuestra lógica de negocio
  - [ ] Documentar hallazgos
  - [ ] Implementar si es necesario

- [ ] **Jornadas medio capturadas, revisar**
  - [ ] Analizar lógica actual de cálculo de jornadas parciales
  - [ ] Validar cálculo de DaysPaid para períodos incompletos
  - [ ] Verificar manejo de días fraccionados (ej: 5.5 días)
  - [ ] Asegurar coherencia con attendance tracking
  - [ ] Revisar casos edge:
    - [ ] Empleados que ingresan a mitad de período
    - [ ] Empleados con incapacidades
    - [ ] Empleados con ausencias justificadas/injustificadas
  - [ ] Crear tests para escenarios de jornadas parciales

### 5. User Interface & Workflow
- [ ] **Poder editar la nomina**
  - [ ] Diseñar flujo de edición de nómina
  - [ ] Determinar qué campos son editables post-cálculo
  - [ ] Implementar validaciones de edición
  - [ ] Agregar audit trail para cambios manuales
  - [ ] Crear endpoints para edición
    - [ ] PATCH /payrolls/:id/perceptions
    - [ ] PATCH /payrolls/:id/deductions
    - [ ] PATCH /payrolls/:id/general-data
  - [ ] Implementar recálculo de totales post-edición
  - [ ] Agregar confirmación antes de timbrado
  - [ ] Prevenir edición de nóminas ya timbradas

### 6. Employee Lifecycle Management
- [ ] **Ver como capturar gente que se va**
  - [ ] Diseñar flujo de terminación de empleados
  - [ ] Implementar cálculo de finiquito
    - [ ] Días trabajados del período
    - [ ] Vacaciones pendientes
    - [ ] Prima vacacional proporcional
    - [ ] Aguinaldo proporcional
    - [ ] Prima de antigüedad (si aplica)
    - [ ] Indemnización (si aplica)
  - [ ] Crear percepción tipo "023" (Pagos por separación)
  - [ ] Manejar split de exento/gravado para finiquitos
  - [ ] Implementar nómina extraordinaria tipo "E"
  - [ ] Agregar campo de motivo de terminación
  - [ ] Crear reporte de finiquito
  - [ ] Validar cumplimiento legal de cálculos

---

## Implementation Phases

### Phase 1: Foundation (Week 1-2)
1. Schema updates and migrations
2. Tax calculation service base
3. UMA service and configuration
4. Basic payload structure

### Phase 2: Core Logic (Week 3-4)
1. Complete tax split logic for all perception types
2. Facturama mapper service
3. Validation layer
4. Annual accumulation tracking

### Phase 3: Integration (Week 5-6)
1. Facturama API client
2. Sandbox testing
3. Error handling and retry logic
4. Webhook handling (if applicable)

### Phase 4: UI & Business Logic (Week 7-8)
1. Payroll editing functionality
2. Employee termination workflow
3. Partial period calculations
4. Admin interface improvements

### Phase 5: Testing & Deployment (Week 9-10)
1. Comprehensive test suite
2. Data migration and backfill
3. Production deployment
4. Monitoring and alerts

---

## Technical Decisions Needed

### High Priority
- [ ] ¿Usar librería existente para cálculos fiscales o implementar custom?
- [ ] ¿Dónde almacenar valores de UMA históricos?
- [ ] ¿Estrategia de versionado para cambios en reglas SAT?
- [ ] ¿Manejo de timbrado: automático o manual?

### Medium Priority
- [ ] ¿Permitir múltiples nóminas por período por empleado?
- [ ] ¿Manejo de correcciones: nueva nómina o ajustes?
- [ ] ¿Integración con contabilidad automática?

### Low Priority
- [ ] ¿Exportación de reportes en formatos específicos?
- [ ] ¿Dashboard de métricas fiscales?

---

## Risks & Mitigation

### Technical Risks
1. **Complejidad de reglas fiscales**
   - Mitigation: Consultar con contador/fiscal expert
   - Mitigation: Implementar configuración flexible

2. **Cambios en regulación SAT**
   - Mitigation: Diseño modular y configurable
   - Mitigation: Versionado de reglas fiscales

3. **Datos faltantes en sistema legacy**
   - Mitigation: Scripts de validación y backfill
   - Mitigation: Proceso de captura gradual

### Business Risks
1. **Timing de implementación vs períodos de nómina**
   - Mitigation: Plan de rollout por fases
   - Mitigation: Mantener proceso manual como fallback

2. **Capacitación de usuarios**
   - Mitigation: Documentación detallada
   - Mitigation: Sesiones de training

---

## Success Criteria

- [ ] 100% de nóminas generan CFDI válido en sandbox
- [ ] Todos los campos requeridos por SAT están poblados
- [ ] Splits de exento/gravado calculados correctamente
- [ ] Sistema validado con al menos 3 casos reales
- [ ] Performance: generación de payload < 500ms
- [ ] Cobertura de tests > 80%
- [ ] Documentación completa de API y procesos

---

## Notes & Considerations

### UMA Current Value (2024)
- Daily: $108.57 MXN
- Monthly: $3,300.53 MXN
- Annual: $39,606.36 MXN

### Important Dates
- UMA updates: Annually (February)
- Tax law changes: Check quarterly
- SAT catalog updates: Monitor continuously

### References
- Ley del ISR (Income Tax Law)
- Ley del Seguro Social (Social Security Law)
- SAT Anexo 20 (CFDI specifications)
- Facturama API docs

---

## Team Assignments
- [ ] Backend Lead: Schema design and API implementation
- [ ] Tax Logic: Calculations and validation rules
- [ ] Frontend: UI for editing and workflows
- [ ] QA: Test scenarios and validation
- [ ] DevOps: Deployment and monitoring setup

---

**Last Updated**: 2025-11-25
**Status**: Planning
**Priority**: High
**Estimated Effort**: 10 weeks
