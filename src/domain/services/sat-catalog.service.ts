/**
 * SAT Catalog Service
 * Provides validation and lookup methods for SAT catalogs used in CFDI Nómina
 */

import {
  SATContractType,
  SATRegimeType,
  SATJourneyType,
  SATPaymentFrequency,
  SATFiscalRegime,
  SATWorkRiskClass,
  SATResourceOrigin,
  SATFederalEntity,
} from "../enums/sat-cfdi.enum";

// Catalog item interface
export interface SATCatalogItem {
  code: string;
  description: string;
}

// Catalog descriptions
const CONTRACT_TYPE_DESCRIPTIONS: Record<SATContractType, string> = {
  [SATContractType.Permanent]: "Contrato de trabajo por tiempo indeterminado",
  [SATContractType.Temporary]: "Contrato de trabajo para obra determinada",
  [SATContractType.SeasonOrCycle]: "Contrato de trabajo por temporada",
  [SATContractType.Training]: "Contrato de trabajo sujeto a prueba",
  [SATContractType.InitialTraining]: "Contrato de trabajo con capacitación inicial",
  [SATContractType.HomeBased]: "Modalidad de contratación por pago de hora laborada",
  [SATContractType.TrialPeriod]: "Modalidad de trabajo por comisión laboral",
  [SATContractType.RetiredPayments]: "Modalidad de contratación donde no existe relación de trabajo",
  [SATContractType.Retirement]: "Jubilación, pensión, retiro",
  [SATContractType.Other]: "Otro contrato",
};

const REGIME_TYPE_DESCRIPTIONS: Record<SATRegimeType, string> = {
  [SATRegimeType.Salaries]: "Sueldos (Incluye ingresos señalados en la fracción I del artículo 94 de LISR)",
  [SATRegimeType.Retirement]: "Jubilados",
  [SATRegimeType.Pensions]: "Pensionados",
  [SATRegimeType.Assimilated]: "Asimilados Miembros Sociedades Cooperativas Producción",
  [SATRegimeType.BoardMembers]: "Asimilados Integrantes Sociedades Asociaciones Civiles",
  [SATRegimeType.Fees]: "Asimilados Honorarios",
  [SATRegimeType.CommissionAgents]: "Asimilados comisionistas",
  [SATRegimeType.AssimilatedOther]: "Asimilados Otros",
  [SATRegimeType.Retirement402]: "Asimilados obtengan ingresos acciones",
  [SATRegimeType.Syndicate]: "Asimilados ingresos sindicatos",
  [SATRegimeType.Severance]: "Indemnizaciones o Separaciones",
  [SATRegimeType.DeathBenefit]: "Subsidios por incapacidad",
};

const JOURNEY_TYPE_DESCRIPTIONS: Record<SATJourneyType, string> = {
  [SATJourneyType.Day]: "Diurna",
  [SATJourneyType.Night]: "Nocturna",
  [SATJourneyType.Mixed]: "Mixta",
  [SATJourneyType.ByHour]: "Por hora",
  [SATJourneyType.Reduced]: "Reducida",
  [SATJourneyType.Continuous]: "Continuada",
  [SATJourneyType.Split]: "Partida",
  [SATJourneyType.ByTurn]: "Por turnos",
  [SATJourneyType.Other]: "Otra jornada",
};

const PAYMENT_FREQUENCY_DESCRIPTIONS: Record<SATPaymentFrequency, string> = {
  [SATPaymentFrequency.Daily]: "Diario",
  [SATPaymentFrequency.Weekly]: "Semanal",
  [SATPaymentFrequency.Biweekly]: "Catorcenal",
  [SATPaymentFrequency.Quincenal]: "Quincenal",
  [SATPaymentFrequency.Monthly]: "Mensual",
  [SATPaymentFrequency.Bimonthly]: "Bimestral",
  [SATPaymentFrequency.ByUnit]: "Unidad obra",
  [SATPaymentFrequency.ByCommission]: "Comisión",
  [SATPaymentFrequency.ByPrice]: "Precio alzado",
  [SATPaymentFrequency.Decennial]: "Decenal",
  [SATPaymentFrequency.Other]: "Otra periodicidad",
};

const FISCAL_REGIME_DESCRIPTIONS: Record<SATFiscalRegime, string> = {
  [SATFiscalRegime.SalariesAndWages]: "Sueldos y Salarios e Ingresos Asimilados a Salarios",
  [SATFiscalRegime.WithoutFiscalObligations]: "Sin obligaciones fiscales",
};

const WORK_RISK_CLASS_DESCRIPTIONS: Record<SATWorkRiskClass, string> = {
  [SATWorkRiskClass.ClassI]: "Clase I - Riesgo ordinario",
  [SATWorkRiskClass.ClassII]: "Clase II - Riesgo bajo",
  [SATWorkRiskClass.ClassIII]: "Clase III - Riesgo medio",
  [SATWorkRiskClass.ClassIV]: "Clase IV - Riesgo alto",
  [SATWorkRiskClass.ClassV]: "Clase V - Riesgo máximo",
};

const RESOURCE_ORIGIN_DESCRIPTIONS: Record<SATResourceOrigin, string> = {
  [SATResourceOrigin.IncomePayment]: "Ingresos propios",
  [SATResourceOrigin.FederalResources]: "Ingreso federales",
  [SATResourceOrigin.MixedIncome]: "Ingresos mixtos",
};

const FEDERAL_ENTITY_DESCRIPTIONS: Record<SATFederalEntity, string> = {
  [SATFederalEntity.Aguascalientes]: "Aguascalientes",
  [SATFederalEntity.BajaCalifornia]: "Baja California",
  [SATFederalEntity.BajaCaliforniaSur]: "Baja California Sur",
  [SATFederalEntity.Campeche]: "Campeche",
  [SATFederalEntity.Chiapas]: "Chiapas",
  [SATFederalEntity.Chihuahua]: "Chihuahua",
  [SATFederalEntity.CoahuilaDeZaragoza]: "Coahuila de Zaragoza",
  [SATFederalEntity.Colima]: "Colima",
  [SATFederalEntity.DistritoFederal]: "Ciudad de México",
  [SATFederalEntity.Durango]: "Durango",
  [SATFederalEntity.Guanajuato]: "Guanajuato",
  [SATFederalEntity.Guerrero]: "Guerrero",
  [SATFederalEntity.Hidalgo]: "Hidalgo",
  [SATFederalEntity.Jalisco]: "Jalisco",
  [SATFederalEntity.Mexico]: "México",
  [SATFederalEntity.MichoacanDeOcampo]: "Michoacán de Ocampo",
  [SATFederalEntity.Morelos]: "Morelos",
  [SATFederalEntity.Nayarit]: "Nayarit",
  [SATFederalEntity.NuevoLeon]: "Nuevo León",
  [SATFederalEntity.Oaxaca]: "Oaxaca",
  [SATFederalEntity.Puebla]: "Puebla",
  [SATFederalEntity.Queretaro]: "Querétaro",
  [SATFederalEntity.QuintanaRoo]: "Quintana Roo",
  [SATFederalEntity.SanLuisPotosi]: "San Luis Potosí",
  [SATFederalEntity.Sinaloa]: "Sinaloa",
  [SATFederalEntity.Sonora]: "Sonora",
  [SATFederalEntity.Tabasco]: "Tabasco",
  [SATFederalEntity.Tamaulipas]: "Tamaulipas",
  [SATFederalEntity.Tlaxcala]: "Tlaxcala",
  [SATFederalEntity.VeracruzDeIgnacioDeLaLlave]: "Veracruz de Ignacio de la Llave",
  [SATFederalEntity.Yucatan]: "Yucatán",
  [SATFederalEntity.Zacatecas]: "Zacatecas",
};

/**
 * SAT Catalog Service
 * Stateless service for SAT catalog validation and lookup
 */
export class SATCatalogService {
  // Contract Type
  static validateContractType(code: string): boolean {
    return Object.values(SATContractType).includes(code as SATContractType);
  }

  static getContractType(code: string): SATCatalogItem | null {
    if (!this.validateContractType(code)) return null;
    return {
      code,
      description: CONTRACT_TYPE_DESCRIPTIONS[code as SATContractType],
    };
  }

  static getAllContractTypes(): SATCatalogItem[] {
    return Object.values(SATContractType).map((code) => ({
      code,
      description: CONTRACT_TYPE_DESCRIPTIONS[code],
    }));
  }

  // Regime Type
  static validateRegimeType(code: string): boolean {
    return Object.values(SATRegimeType).includes(code as SATRegimeType);
  }

  static getRegimeType(code: string): SATCatalogItem | null {
    if (!this.validateRegimeType(code)) return null;
    return {
      code,
      description: REGIME_TYPE_DESCRIPTIONS[code as SATRegimeType],
    };
  }

  static getAllRegimeTypes(): SATCatalogItem[] {
    return Object.values(SATRegimeType).map((code) => ({
      code,
      description: REGIME_TYPE_DESCRIPTIONS[code],
    }));
  }

  // Journey Type
  static validateJourneyType(code: string): boolean {
    return Object.values(SATJourneyType).includes(code as SATJourneyType);
  }

  static getJourneyType(code: string): SATCatalogItem | null {
    if (!this.validateJourneyType(code)) return null;
    return {
      code,
      description: JOURNEY_TYPE_DESCRIPTIONS[code as SATJourneyType],
    };
  }

  static getAllJourneyTypes(): SATCatalogItem[] {
    return Object.values(SATJourneyType).map((code) => ({
      code,
      description: JOURNEY_TYPE_DESCRIPTIONS[code],
    }));
  }

  // Payment Frequency
  static validatePaymentFrequency(code: string): boolean {
    return Object.values(SATPaymentFrequency).includes(code as SATPaymentFrequency);
  }

  static getPaymentFrequency(code: string): SATCatalogItem | null {
    if (!this.validatePaymentFrequency(code)) return null;
    return {
      code,
      description: PAYMENT_FREQUENCY_DESCRIPTIONS[code as SATPaymentFrequency],
    };
  }

  static getAllPaymentFrequencies(): SATCatalogItem[] {
    return Object.values(SATPaymentFrequency).map((code) => ({
      code,
      description: PAYMENT_FREQUENCY_DESCRIPTIONS[code],
    }));
  }

  // Fiscal Regime
  static validateFiscalRegime(code: string): boolean {
    return Object.values(SATFiscalRegime).includes(code as SATFiscalRegime);
  }

  static getFiscalRegime(code: string): SATCatalogItem | null {
    if (!this.validateFiscalRegime(code)) return null;
    return {
      code,
      description: FISCAL_REGIME_DESCRIPTIONS[code as SATFiscalRegime],
    };
  }

  static getAllFiscalRegimes(): SATCatalogItem[] {
    return Object.values(SATFiscalRegime).map((code) => ({
      code,
      description: FISCAL_REGIME_DESCRIPTIONS[code],
    }));
  }

  // Work Risk Class
  static validateWorkRiskClass(code: string): boolean {
    return Object.values(SATWorkRiskClass).includes(code as SATWorkRiskClass);
  }

  static getWorkRiskClass(code: string): SATCatalogItem | null {
    if (!this.validateWorkRiskClass(code)) return null;
    return {
      code,
      description: WORK_RISK_CLASS_DESCRIPTIONS[code as SATWorkRiskClass],
    };
  }

  static getAllWorkRiskClasses(): SATCatalogItem[] {
    return Object.values(SATWorkRiskClass).map((code) => ({
      code,
      description: WORK_RISK_CLASS_DESCRIPTIONS[code],
    }));
  }

  // Resource Origin
  static validateResourceOrigin(code: string): boolean {
    return Object.values(SATResourceOrigin).includes(code as SATResourceOrigin);
  }

  static getResourceOrigin(code: string): SATCatalogItem | null {
    if (!this.validateResourceOrigin(code)) return null;
    return {
      code,
      description: RESOURCE_ORIGIN_DESCRIPTIONS[code as SATResourceOrigin],
    };
  }

  static getAllResourceOrigins(): SATCatalogItem[] {
    return Object.values(SATResourceOrigin).map((code) => ({
      code,
      description: RESOURCE_ORIGIN_DESCRIPTIONS[code],
    }));
  }

  // Federal Entity
  static validateFederalEntity(code: string): boolean {
    return Object.values(SATFederalEntity).includes(code as SATFederalEntity);
  }

  static getFederalEntity(code: string): SATCatalogItem | null {
    if (!this.validateFederalEntity(code)) return null;
    return {
      code,
      description: FEDERAL_ENTITY_DESCRIPTIONS[code as SATFederalEntity],
    };
  }

  static getAllFederalEntities(): SATCatalogItem[] {
    return Object.values(SATFederalEntity).map((code) => ({
      code,
      description: FEDERAL_ENTITY_DESCRIPTIONS[code],
    }));
  }

  // Default values for HVP
  static getHVPDefaults() {
    return {
      contractType: SATContractType.Permanent,
      regimeType: SATRegimeType.Salaries,
      journeyType: SATJourneyType.Mixed,
      paymentFrequency: SATPaymentFrequency.Quincenal,
      fiscalRegime: SATFiscalRegime.SalariesAndWages,
      workRiskClass: SATWorkRiskClass.ClassI,
      federalEntity: SATFederalEntity.Yucatan,
    };
  }
}