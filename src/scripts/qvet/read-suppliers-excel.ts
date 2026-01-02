/**
 * QVET Excel Reader
 * Lee archivos Excel descargados de QVET y los convierte a JSON
 */

import * as XLSX from 'xlsx';

export interface SupplierRow {
  [key: string]: any;
}

export function readSuppliersExcel(filePath: string): SupplierRow[] {
  console.log('📖 Leyendo archivo Excel:', filePath);

  try {
    // Leer archivo
    const workbook = XLSX.readFile(filePath);

    // Obtener primera hoja
    const sheetName = workbook.SheetNames[0];
    console.log(`   📄 Hoja: ${sheetName}`);

    const worksheet = workbook.Sheets[sheetName];

    // Convertir a JSON
    const data: SupplierRow[] = XLSX.utils.sheet_to_json(worksheet);

    console.log(`   ✅ Total de filas: ${data.length}`);

    return data;

  } catch (error: any) {
    console.error('❌ Error leyendo archivo Excel:', error.message);
    throw error;
  }
}

export function displayFirstRows(data: SupplierRow[], count: number = 2): void {
  console.log(`\n📊 Primeras ${count} filas del reporte:\n`);

  const firstRows = data.slice(0, count);

  firstRows.forEach((row, index) => {
    console.log(`--- Fila ${index + 1} ---`);
    console.log(JSON.stringify(row, null, 2));
    console.log();
  });

  console.log(`📈 Total de registros en el archivo: ${data.length}`);
}

export function displayFirstResult(data: SupplierRow[]): void {
  if (data.length === 0) {
    console.log('\n⚠️  No hay datos en el archivo');
    return;
  }

  console.log('\n🔍 PRIMER RESULTADO:\n');
  console.log(JSON.stringify(data[0], null, 2));
  console.log();
}
