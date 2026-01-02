/**
 * SAT Catalog Enums for CFDI Nómina
 * Based on SAT catalogs for payroll CFDI (version 4.0)
 */

/**
 * c_TipoContrato - Contract Type
 * SAT catalog for employment contract types
 */
export enum SATContractType {
  Permanent = "01", // Contrato de trabajo por tiempo indeterminado
  Temporary = "02", // Contrato de trabajo para obra determinada
  SeasonOrCycle = "03", // Contrato de trabajo por temporada
  Training = "04", // Contrato de trabajo sujeto a prueba
  InitialTraining = "05", // Contrato de trabajo con capacitación inicial
  HomeBased = "06", // Modalidad de contratación por pago de hora laborada
  TrialPeriod = "07", // Modalidad de trabajo por comisión laboral
  RetiredPayments = "08", // Modalidad de contratación donde no existe relación de trabajo
  Retirement = "09", // Jubilación, pensión, retiro
  Other = "99", // Otro contrato
}

/**
 * c_TipoRegimen - Regime Type
 * SAT catalog for employment regime types
 */
export enum SATRegimeType {
  Salaries = "02", // Sueldos (Incluye ingresos señalados en la fracción I del artículo 94 de LISR)
  Retirement = "03", // Jubilados
  Pensions = "04", // Pensionados
  Assimilated = "05", // Asimilados Miembros Sociedades Cooperativas Producción
  BoardMembers = "06", // Asimilados Integrantes Sociedades Asociaciones Civiles
  Fees = "07", // Asimilados Honorarios
  CommissionAgents = "08", // Asimilados comisionistas
  AssimilatedOther = "09", // Asimilados Otros
  Retirement402 = "10", // Asimilados obtengan ingresos acciones
  Syndicate = "11", // Asimilados ingresos sindicatos
  Severance = "12", // Indemnizaciones o Separaciones
  DeathBenefit = "13", // Subsidios por incapacidad
}

/**
 * c_TipoJornada - Journey/Workday Type
 * SAT catalog for workday types
 */
export enum SATJourneyType {
  Day = "01", // Diurna
  Night = "02", // Nocturna
  Mixed = "03", // Mixta
  ByHour = "04", // Por hora
  Reduced = "05", // Reducida
  Continuous = "06", // Continuada
  Split = "07", // Partida
  ByTurn = "08", // Por turnos
  Other = "99", // Otra jornada
}

/**
 * c_PeriodicidadPago - Payment Frequency
 * SAT catalog for payment frequencies
 */
export enum SATPaymentFrequency {
  Daily = "01", // Diario
  Weekly = "02", // Semanal
  Biweekly = "03", // Catorcenal
  Quincenal = "04", // Quincenal
  Monthly = "05", // Mensual
  Bimonthly = "06", // Bimestral
  ByUnit = "07", // Unidad obra
  ByCommission = "08", // Comisión
  ByPrice = "09", // Precio alzado
  Decennial = "10", // Decenal
  Other = "99", // Otra periodicidad
}

/**
 * c_RegimenFiscal - Fiscal Regime (for employees)
 * Common fiscal regimes used in payroll
 */
export enum SATFiscalRegime {
  SalariesAndWages = "605", // Sueldos y Salarios e Ingresos Asimilados a Salarios
  WithoutFiscalObligations = "616", // Sin obligaciones fiscales
}

/**
 * c_RiesgoPuesto - Work Risk Class
 * SAT catalog for work risk classification
 */
export enum SATWorkRiskClass {
  ClassI = "1", // Clase I - Riesgo ordinario
  ClassII = "2", // Clase II - Riesgo bajo
  ClassIII = "3", // Clase III - Riesgo medio
  ClassIV = "4", // Clase IV - Riesgo alto
  ClassV = "5", // Clase V - Riesgo máximo
}

/**
 * c_OrigenRecurso - Resource Origin
 * SAT catalog for resource origin (for certain payment types)
 */
export enum SATResourceOrigin {
  IncomePayment = "IP", // Ingresos propios
  FederalResources = "IF", // Ingreso federales
  MixedIncome = "IM", // Ingresos mixtos
}

/**
 * c_Estado - Federal Entity Keys
 * SAT catalog for Mexican states (abbreviated list - common ones for HVP)
 */
export enum SATFederalEntity {
  Aguascalientes = "AGU",
  BajaCalifornia = "BCN",
  BajaCaliforniaSur = "BCS",
  Campeche = "CAM",
  Chiapas = "CHP",
  Chihuahua = "CHH",
  CoahuilaDeZaragoza = "COA",
  Colima = "COL",
  DistritoFederal = "DIF", // CDMX
  Durango = "DUR",
  Guanajuato = "GUA",
  Guerrero = "GRO",
  Hidalgo = "HID",
  Jalisco = "JAL",
  Mexico = "MEX",
  MichoacanDeOcampo = "MIC",
  Morelos = "MOR",
  Nayarit = "NAY",
  NuevoLeon = "NLE",
  Oaxaca = "OAX",
  Puebla = "PUE",
  Queretaro = "QUE",
  QuintanaRoo = "ROO",
  SanLuisPotosi = "SLP",
  Sinaloa = "SIN",
  Sonora = "SON",
  Tabasco = "TAB",
  Tamaulipas = "TAM",
  Tlaxcala = "TLA",
  VeracruzDeIgnacioDeLaLlave = "VER",
  Yucatan = "YUC",
  Zacatecas = "ZAC",
}
