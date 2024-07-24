"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPaymentMethod = exports.isInvoiceUsageValidForPhysicalPerson = exports.isInvoiceUsageValidForMoralPerson = exports.isFiscalRegimeValidForPhysicalPerson = exports.isFiscalRegimeValidForMoralPerson = exports.isRFCFromPhysicalPerson = exports.isRFCFromMoralPerson = exports.isValidRFC = void 0;
const billingConstants_1 = require("../constants/billingConstants");
const isValidRFC = (rfc) => {
    const regex = /^[A-ZÑ&]{3,4}\d{6}[A-V1-9][A-Z1-9][0-9A]$/;
    return regex.test(rfc);
};
exports.isValidRFC = isValidRFC;
const isRFCFromMoralPerson = (rfc) => {
    return rfc.length === 12;
};
exports.isRFCFromMoralPerson = isRFCFromMoralPerson;
const isRFCFromPhysicalPerson = (rfc) => {
    return rfc.length === 13;
};
exports.isRFCFromPhysicalPerson = isRFCFromPhysicalPerson;
const isFiscalRegimeValidForMoralPerson = (fiscalRegime) => {
    const moralRegimes = billingConstants_1.FISCAL_REGIMES.filter((regime) => regime.moral).map((regime) => regime.value);
    return moralRegimes.includes(fiscalRegime);
};
exports.isFiscalRegimeValidForMoralPerson = isFiscalRegimeValidForMoralPerson;
const isFiscalRegimeValidForPhysicalPerson = (fiscalRegime) => {
    const physicalRegimes = billingConstants_1.FISCAL_REGIMES.filter((regime) => regime.natural).map((regime) => regime.value);
    return physicalRegimes.includes(fiscalRegime);
};
exports.isFiscalRegimeValidForPhysicalPerson = isFiscalRegimeValidForPhysicalPerson;
const isInvoiceUsageValidForMoralPerson = (invoiceUsage) => {
    const validInvoiceUsages = billingConstants_1.CFDI_USES.filter((use) => use.moral).map((use) => use.value);
    return validInvoiceUsages.includes(invoiceUsage);
};
exports.isInvoiceUsageValidForMoralPerson = isInvoiceUsageValidForMoralPerson;
const isInvoiceUsageValidForPhysicalPerson = (invoiceUsage) => {
    const validInvoiceUsages = billingConstants_1.CFDI_USES.filter((use) => use.natural).map((use) => use.value);
    return validInvoiceUsages.includes(invoiceUsage);
};
exports.isInvoiceUsageValidForPhysicalPerson = isInvoiceUsageValidForPhysicalPerson;
const isValidPaymentMethod = (paymentMethod) => {
    const validPaymentMethods = billingConstants_1.PAYMENT_METHODS.map((method) => method.value);
    return validPaymentMethods.includes(paymentMethod);
};
exports.isValidPaymentMethod = isValidPaymentMethod;
