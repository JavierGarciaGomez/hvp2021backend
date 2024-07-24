"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomerRFCDTO = void 0;
const billingHelpers_1 = require("../../../shared/helpers/billingHelpers");
const addressesHelpers_1 = require("../../../shared/helpers/addressesHelpers");
class CustomerRFCDTO {
    constructor(data) {
        this.data = data;
    }
    static create(data) {
        return this.createOrUpdate(data);
    }
    static update(data) {
        return this.createOrUpdate(data);
    }
    static createOrUpdate(data) {
        const validationError = this.validateOptions(data);
        if (validationError)
            return [validationError];
        return [undefined, new CustomerRFCDTO(Object.assign({}, data))];
    }
    static validateOptions(data) {
        const { rfc, invoice_usage, fiscal_regime, postal_code, name } = data;
        if (!(0, billingHelpers_1.isValidRFC)(rfc)) {
            return "RFC is not valid";
        }
        if ((0, billingHelpers_1.isRFCFromMoralPerson)(rfc)) {
            if (!(0, billingHelpers_1.isInvoiceUsageValidForMoralPerson)(invoice_usage)) {
                return "Invoice usage is not valid for moral person";
            }
            if (!(0, billingHelpers_1.isFiscalRegimeValidForMoralPerson)(fiscal_regime)) {
                return "Fiscal regime is not valid for moral person";
            }
        }
        if ((0, billingHelpers_1.isRFCFromPhysicalPerson)(rfc)) {
            if (!(0, billingHelpers_1.isInvoiceUsageValidForPhysicalPerson)(invoice_usage)) {
                return "Invoice usage is not valid for physical person";
            }
            if (!(0, billingHelpers_1.isFiscalRegimeValidForPhysicalPerson)(fiscal_regime)) {
                return "Fiscal regime is not valid for physical person";
            }
        }
        if (!(0, addressesHelpers_1.isValidPostalCode)(postal_code)) {
            return "Postal code is not valid";
        }
        if (!name) {
            return "Name is required";
        }
        if (!data.email) {
            return "Email is required";
        }
        if (!data.phone_number) {
            return "Phone number is required";
        }
        if (data)
            return undefined;
    }
}
exports.CustomerRFCDTO = CustomerRFCDTO;
