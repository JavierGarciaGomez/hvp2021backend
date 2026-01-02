/**
 * Test de Integración QVET - Proveedores
 *
 * Script maestro que:
 * 1. Descarga el reporte de Proveedores desde QVET
 * 2. Lee el archivo Excel
 * 3. Muestra las primeras 2 filas
 */

import { downloadQvetReport } from './qvet-api-client';
import { readSuppliersExcel, displayFirstResult } from './read-suppliers-excel';

async function testSuppliersIntegration() {
  try {
    console.log('🚀 Iniciando prueba de integración QVET - Proveedores\n');
    console.log('='.repeat(60));
    console.log();

    // Paso 1: Descargar reporte
    const reportId = '508';
    const reportName = 'Proveedores';

    const filePath = await downloadQvetReport(reportId, reportName);

    console.log();
    console.log('='.repeat(60));
    console.log();

    // Paso 2: Leer Excel
    const data = readSuppliersExcel(filePath);

    // Paso 3: Mostrar primer resultado
    displayFirstResult(data);

    console.log('='.repeat(60));
    console.log('✅ Integración exitosa!');
    console.log(`📊 Total de proveedores: ${data.length}`);
    console.log('='.repeat(60));

  } catch (error: any) {
    console.error('\n❌ Error en integración QVET:', error.message);
    process.exit(1);
  }
}

// Ejecutar
testSuppliersIntegration();
