# Plan Inicial - Integración QVET: Descarga y Lectura de Reporte de Proveedores

**Fecha:** 2026-01-01
**Objetivo:** Probar descarga de reporte de proveedores desde QVET y leer datos en el servidor

---

## 🎯 Objetivo Inicial

Crear un script simple que:
1. Descargue el reporte de **Proveedores** (ID 508) desde QVET
2. Lea el archivo Excel descargado
3. Muestre en console.log las primeras 2 filas de datos
4. **NO exponer endpoints** (solo script local por ahora)

---

## 📋 Estado Actual

### ✅ Ya Disponible
- ✅ Script funcional de descarga: `tmp/qvet/qvet-api.ts`
- ✅ Sistema de autenticación QVET implementado
- ✅ Session caching (20 minutos)
- ✅ Logging estructurado en JSON
- ✅ Reporte de Proveedores identificado (ID: 508, sin parámetros)

### 📦 Estructura de Datos QVET
```
data/qvet/
├── reports/           # Reportes Excel descargados
├── logs/             # Logs de API calls
└── session-cache.json # Cache de sesiones
```

---

## 🔧 Pasos del Plan

### 1️⃣ **Preparar Dependencias** ⏱️ ~5 min

**Instalar librería para leer Excel:**
```bash
yarn add xlsx
yarn add -D @types/node
```

**Verificar que existen:**
- `tmp/qvet/qvet-api.ts` - Script de descarga
- Credenciales en código o variables de entorno

---

### 2️⃣ **Adaptar Script de Descarga** ⏱️ ~10 min

**Crear:** `src/scripts/qvet/download-suppliers-report.ts`

**Funcionalidad:**
- Reutilizar el código de `tmp/qvet/qvet-api.ts`
- Configurar descarga específica del reporte ID 508 (Proveedores)
- Simplificar para que NO tome parámetros de línea de comandos
- Hardcodear el reporte de proveedores
- Retornar la ruta del archivo descargado

**Estructura esperada:**
```typescript
import { downloadQvetReport } from './qvet-api-client';

async function downloadSuppliersReport() {
  const reportId = 508;
  const reportName = 'Proveedores';

  console.log('📥 Descargando reporte de proveedores desde QVET...');

  const filePath = await downloadQvetReport(reportId, reportName);

  console.log(`✅ Reporte descargado en: ${filePath}`);
  return filePath;
}

downloadSuppliersReport().catch(console.error);
```

---

### 3️⃣ **Crear Script de Lectura de Excel** ⏱️ ~15 min

**Crear:** `src/scripts/qvet/read-suppliers-excel.ts`

**Funcionalidad:**
- Recibir ruta del archivo Excel
- Usar librería `xlsx` para leerlo
- Parsear la primera hoja (worksheet)
- Extraer las primeras 2 filas de datos
- Mostrar en console.log de forma legible

**Estructura esperada:**
```typescript
import * as XLSX from 'xlsx';

interface SupplierRow {
  // Definir después de ver estructura real
  [key: string]: any;
}

function readSuppliersExcel(filePath: string) {
  console.log('📖 Leyendo archivo Excel:', filePath);

  // Leer archivo
  const workbook = XLSX.readFile(filePath);

  // Obtener primera hoja
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];

  // Convertir a JSON
  const data: SupplierRow[] = XLSX.utils.sheet_to_json(worksheet);

  // Mostrar primeras 2 filas
  console.log('\n📊 Primeras 2 filas del reporte:');
  console.log(JSON.stringify(data.slice(0, 2), null, 2));

  return data;
}

export { readSuppliersExcel };
```

---

### 4️⃣ **Crear Script Maestro** ⏱️ ~10 min

**Crear:** `src/scripts/qvet/test-suppliers-integration.ts`

**Funcionalidad:**
- Orquestar descarga + lectura
- Manejo de errores
- Logging claro de cada paso

**Estructura:**
```typescript
import { downloadSuppliersReport } from './download-suppliers-report';
import { readSuppliersExcel } from './read-suppliers-excel';

async function testSuppliersIntegration() {
  try {
    console.log('🚀 Iniciando prueba de integración QVET - Proveedores\n');

    // Paso 1: Descargar
    const filePath = await downloadSuppliersReport();

    // Paso 2: Leer
    const data = readSuppliersExcel(filePath);

    console.log('\n✅ Integración exitosa!');
    console.log(`📊 Total de proveedores en el reporte: ${data.length}`);

  } catch (error) {
    console.error('❌ Error en integración QVET:', error);
    process.exit(1);
  }
}

testSuppliersIntegration();
```

---

### 5️⃣ **Agregar Script NPM** ⏱️ ~2 min

**Modificar:** `package.json`

```json
{
  "scripts": {
    "qvet:test-suppliers": "ts-node src/scripts/qvet/test-suppliers-integration.ts"
  }
}
```

---

### 6️⃣ **Ejecutar y Validar** ⏱️ ~5 min

**Ejecutar:**
```bash
yarn qvet:test-suppliers
```

**Validaciones esperadas:**
- ✅ Se descarga el archivo Excel
- ✅ El archivo se guarda en `data/qvet/reports/Proveedores-{timestamp}.xlsx`
- ✅ Se leen las primeras 2 filas correctamente
- ✅ Los datos se muestran en formato JSON legible
- ✅ Se logea el total de proveedores

**Output esperado:**
```
🚀 Iniciando prueba de integración QVET - Proveedores

📥 Descargando reporte de proveedores desde QVET...
✅ Reporte descargado en: data/qvet/reports/Proveedores-20260101-120000.xlsx

📖 Leyendo archivo Excel: data/qvet/reports/Proveedores-20260101-120000.xlsx

📊 Primeras 2 filas del reporte:
[
  {
    "Codigo": "PROV001",
    "Nombre": "Proveedor Ejemplo 1",
    "Telefono": "999-123-4567",
    ...
  },
  {
    "Codigo": "PROV002",
    "Nombre": "Proveedor Ejemplo 2",
    "Telefono": "999-765-4321",
    ...
  }
]

✅ Integración exitosa!
📊 Total de proveedores en el reporte: 45
```

---

## 🔍 Investigación Necesaria

Durante la ejecución necesitamos documentar:

1. **Estructura real del Excel de proveedores:**
   - ¿Qué columnas tiene?
   - ¿Cómo se llaman exactamente?
   - ¿Hay headers o empieza directo con datos?

2. **Mapeo a MongoDB:**
   - ¿Qué campos nos interesan?
   - ¿Cómo mapean con nuestro modelo de Suppliers existente?
   - ¿Hay un identificador único confiable?

---

## 📝 Próximos Pasos (Fuera de este Plan)

Una vez validada la descarga y lectura:

1. **Mapeo de Datos:**
   - Crear mapper de QVET → MongoDB
   - Definir estrategia de sincronización (upsert por código único)

2. **Script de Importación:**
   - Conectar a MongoDB
   - Insertar/actualizar proveedores
   - Logging de cambios

3. **Validaciones:**
   - Datos duplicados
   - Campos requeridos
   - Formato de datos

4. **Automatización:**
   - Cron job para descarga periódica
   - Notificaciones de errores

5. **API Endpoints** (si se requiere):
   - POST `/api/qvet/sync/suppliers` - Trigger manual
   - GET `/api/qvet/sync/status` - Estado de última sincronización

---

## ⚠️ Consideraciones

### Seguridad
- ✅ Credenciales ya están en código (con fallback a .env)
- ⚠️ Considerar mover 100% a variables de entorno
- ✅ Session caching reduce exposición de credenciales

### Performance
- ✅ Session cache (20 min) reduce llamadas de login
- ✅ Descarga directa es rápida (10-15 seg)

### Error Handling
- Session expirada → Re-login automático
- Archivo corrupto → Log + retry
- QVET caído → Log + notificación

---

## 📚 Referencias

- Código base: `tmp/qvet/qvet-api.ts`
- Documentación: `tmp/qvet/QVET.md`
- Reporte ID: 508 (Proveedores)

---

## ✅ Criterios de Éxito

- [ ] Script descarga reporte de proveedores exitosamente
- [ ] Archivo Excel se guarda en `data/qvet/reports/`
- [ ] Script lee y parsea el Excel correctamente
- [ ] Se muestran las primeras 2 filas en console.log
- [ ] Se muestra el total de proveedores
- [ ] Todo funciona con un solo comando: `yarn qvet:test-suppliers`

---

**Tiempo estimado total:** ~50 minutos

**Riesgo:** Bajo (código base ya probado y funcional)
