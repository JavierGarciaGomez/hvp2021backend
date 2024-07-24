import {
  CFDI_USES,
  FISCAL_REGIMES,
  PAYMENT_METHODS,
} from "../data/constants/billingConstants";

export const isValidRFC = (rfc: string): boolean => {
  const regex = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
  return regex.test(rfc);
};

export const isRFCFromMoralPerson = (rfc: string): boolean => {
  return rfc.length === 12;
};

export const isRFCFromPhysicalPerson = (rfc: string): boolean => {
  return rfc.length === 13;
};

export const isFiscalRegimeValidForMoralPerson = (
  fiscalRegime: string
): boolean => {
  const moralRegimes = FISCAL_REGIMES.filter((regime) => regime.moral).map(
    (regime) => regime.value
  );
  return moralRegimes.includes(fiscalRegime);
};

export const isFiscalRegimeValidForPhysicalPerson = (
  fiscalRegime: string
): boolean => {
  const physicalRegimes = FISCAL_REGIMES.filter((regime) => regime.natural).map(
    (regime) => regime.value
  );
  return physicalRegimes.includes(fiscalRegime);
};

export const isInvoiceUsageValidForMoralPerson = (
  invoiceUsage: string
): boolean => {
  const validInvoiceUsages = CFDI_USES.filter((use) => use.moral).map(
    (use) => use.value
  );
  return validInvoiceUsages.includes(invoiceUsage);
};

export const isInvoiceUsageValidForPhysicalPerson = (
  invoiceUsage: string
): boolean => {
  const validInvoiceUsages = CFDI_USES.filter((use) => use.natural).map(
    (use) => use.value
  );
  return validInvoiceUsages.includes(invoiceUsage);
};

export const isValidPaymentMethod = (paymentMethod: string): boolean => {
  const validPaymentMethods = PAYMENT_METHODS.map((method) => method.value);
  return validPaymentMethods.includes(paymentMethod);
};
