# SP2 Frontend Tasks - CFDI Fields

## Overview

Backend changes for SP2 (New Resources for CFDI Integration).

**Breaking changes:** No - all new fields are optional
**Priority:** Can be done anytime before SP6 (Facturama Integration)

---

## 1. CompanySettings (New Resource)

Singleton resource for company fiscal configuration.

### Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/company-settings` | Get settings (returns single object or 404) |
| `POST` | `/api/company-settings` | Create (fails if already exists) - Admin only |
| `PATCH` | `/api/company-settings` | Partial update - Admin only |

### Data Types

```typescript
interface CompanySettings {
  id?: string;
  name: string;                    // Required
  rfc: string;                     // Required, 12 chars
  employerRegistration: string;    // Required
  expeditionZipCode: string;       // Required, 5 digits
  federalEntityKey: string;        // Required, see SAT_FEDERAL_ENTITIES
  fiscalAddress?: Address;         // Optional
  createdAt?: string;
  updatedAt?: string;
}

interface Address {
  street?: string;
  exteriorNumber?: string;
  interiorNumber?: string;
  neighborhood?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
}
```

---

## 2. Collaborator - New Fields

New optional fields added to existing Collaborator entity.

### Endpoints

Existing endpoints, same behavior:
- `GET /api/collaborators/:id`
- `PUT /api/collaborators/:id`

### New Fields

```typescript
// Added to Collaborator
interface CollaboratorCfdiFields {
  fiscalAddress?: Address;     // Optional fiscal address
  taxZipCode?: string;         // Tax zip code for CFDI
  contractType?: string;       // SAT code, see SAT_CONTRACT_TYPES
  regimeType?: string;         // SAT code, see SAT_REGIME_TYPES
  fiscalRegime?: string;       // SAT code, see SAT_FISCAL_REGIMES
  bank?: string;               // Bank name
  bankAccount?: string;        // Bank account number
}
```

---

## 3. SAT Catalogs (Dropdown Values)

### SAT_CONTRACT_TYPES (contractType)

```typescript
const SAT_CONTRACT_TYPES = [
  { value: "01", label: "Contrato de Trabajo por Tiempo Indeterminado" },
  { value: "02", label: "Contrato de Trabajo para Obra Determinada" },
  { value: "03", label: "Contrato de Trabajo por Tiempo Determinado" },
  { value: "04", label: "Contrato de Trabajo por Temporada" },
  { value: "05", label: "Contrato de Trabajo Sujeto a Prueba" },
  { value: "06", label: "Contrato de Trabajo con Capacitación Inicial" },
  { value: "07", label: "Modalidad de Contratación por Pago de Hora Laborada" },
  { value: "08", label: "Modalidad de Trabajo por Comisión Laboral" },
  { value: "09", label: "Modalidades de Contratación donde no Existe Relación de Trabajo" },
  { value: "10", label: "Jubilación, Pensión, Retiro" },
  { value: "99", label: "Otro Contrato" },
];
// Default: "01"
```

### SAT_REGIME_TYPES (regimeType)

```typescript
const SAT_REGIME_TYPES = [
  { value: "02", label: "Sueldos (Incluye ingresos señalados en la fracción I del artículo 94 de LISR)" },
  { value: "03", label: "Jubilados" },
  { value: "04", label: "Pensionados" },
  { value: "05", label: "Asimilados Miembros Sociedades Cooperativas Produccion" },
  { value: "06", label: "Asimilados Integrantes Sociedades Asociaciones Civiles" },
  { value: "07", label: "Asimilados Miembros consejos" },
  { value: "08", label: "Asimilados comisionistas" },
  { value: "09", label: "Asimilados Honorarios" },
  { value: "10", label: "Asimilados acciones" },
  { value: "11", label: "Asimilados otros" },
  { value: "12", label: "Jubilados o Pensionados" },
  { value: "13", label: "Indemnización o Separación" },
  { value: "99", label: "Otro Regimen" },
];
// Default: "02"
```

### SAT_FISCAL_REGIMES (fiscalRegime)

```typescript
const SAT_FISCAL_REGIMES = [
  { value: "605", label: "Sueldos y Salarios e Ingresos Asimilados a Salarios" },
  { value: "606", label: "Arrendamiento" },
  { value: "608", label: "Demás ingresos" },
  { value: "611", label: "Ingresos por Dividendos (socios y accionistas)" },
  { value: "612", label: "Personas Físicas con Actividades Empresariales y Profesionales" },
  { value: "614", label: "Ingresos por intereses" },
  { value: "616", label: "Sin obligaciones fiscales" },
];
// Default: "605"
```

### SAT_FEDERAL_ENTITIES (federalEntityKey)

```typescript
const SAT_FEDERAL_ENTITIES = [
  { value: "AGU", label: "Aguascalientes" },
  { value: "BCN", label: "Baja California" },
  { value: "BCS", label: "Baja California Sur" },
  { value: "CAM", label: "Campeche" },
  { value: "CHP", label: "Chiapas" },
  { value: "CHH", label: "Chihuahua" },
  { value: "COA", label: "Coahuila de Zaragoza" },
  { value: "COL", label: "Colima" },
  { value: "DIF", label: "Ciudad de México" },
  { value: "DUR", label: "Durango" },
  { value: "GUA", label: "Guanajuato" },
  { value: "GRO", label: "Guerrero" },
  { value: "HID", label: "Hidalgo" },
  { value: "JAL", label: "Jalisco" },
  { value: "MEX", label: "México" },
  { value: "MIC", label: "Michoacán de Ocampo" },
  { value: "MOR", label: "Morelos" },
  { value: "NAY", label: "Nayarit" },
  { value: "NLE", label: "Nuevo León" },
  { value: "OAX", label: "Oaxaca" },
  { value: "PUE", label: "Puebla" },
  { value: "QUE", label: "Querétaro" },
  { value: "ROO", label: "Quintana Roo" },
  { value: "SLP", label: "San Luis Potosí" },
  { value: "SIN", label: "Sinaloa" },
  { value: "SON", label: "Sonora" },
  { value: "TAB", label: "Tabasco" },
  { value: "TAM", label: "Tamaulipas" },
  { value: "TLA", label: "Tlaxcala" },
  { value: "VER", label: "Veracruz de Ignacio de la Llave" },
  { value: "YUC", label: "Yucatán" },
  { value: "ZAC", label: "Zacatecas" },
];
// HVP default: "YUC"
```

---

## 4. API Response Format

All responses follow this unified format:

### Success Response

```typescript
{
  ok: true,
  status_code: 200,
  resource: "company-settings",
  operation: "one" | "all" | "create" | "update" | "delete",
  data: T,
  meta?: { total, page, limit, totalPages }  // only for lists
}
```

### Error Response

```typescript
{
  ok: false,
  status_code: 404,
  resource: "company-settings",
  error: {
    code: "NOT_FOUND" | "BAD_REQUEST" | "UNAUTHORIZED" | "FORBIDDEN" | "CONFLICT" | "INTERNAL_ERROR",
    message: "Human readable message",
    details?: { ... }
  }
}
```

### Example Responses

**GET /api/company-settings (200):**
```json
{
  "ok": true,
  "status_code": 200,
  "resource": "company-settings",
  "operation": "one",
  "data": {
    "id": "abc123",
    "name": "Hospital Veterinario Peninsular",
    "rfc": "XXXX010101XXX",
    "employerRegistration": "Y12-34567-89-0",
    "expeditionZipCode": "97000",
    "federalEntityKey": "YUC",
    "fiscalAddress": { ... }
  }
}
```

**GET /api/company-settings (404):**
```json
{
  "ok": false,
  "status_code": 404,
  "resource": "company-settings",
  "error": {
    "code": "NOT_FOUND",
    "message": "Company settings not initialized"
  }
}
```

**POST/PATCH Error (403):**
```json
{
  "ok": false,
  "status_code": 403,
  "resource": "company-settings",
  "error": {
    "code": "FORBIDDEN",
    "message": "Admin access required"
  }
}
```

### Frontend Usage

```typescript
const response = await fetch("/api/company-settings");
const json = await response.json();

if (json.ok) {
  // Success: json.data has the resource
  console.log(json.data);
} else {
  // Error: json.error has the details
  console.error(json.error.message);
}
```

---

## 5. Notes

- All new fields are optional - forms work without them
- Backend sets defaults via migration, frontend can override
- SAT catalogs are static - can be hardcoded
- Auth required: `x-token` + `Authorization: Bearer` headers

---

**Last Updated:** 2026-01-02
**Related Backend PR:** #17
