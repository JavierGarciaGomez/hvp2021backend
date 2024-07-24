"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BillCreationInfoDTO = void 0;
const shared_1 = require("../../../shared");
const helpers_1 = require("../../../shared/helpers");
class BillCreationInfoDTO {
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
        const { status } = data;
        if (!status) {
            data.status = shared_1.BillCreationInfoStatus.PENDING;
        }
        if (validationError)
            return [validationError];
        return [undefined, new BillCreationInfoDTO(Object.assign({}, data))];
    }
    static validateOptions(data) {
        const { customer_rfc, branch, document_number: docNumber, payment_method, bill_date, } = data;
        if (!bill_date || isNaN(new Date(bill_date).getTime())) {
            return "Bill date is required and must be a valid date";
        }
        if (!customer_rfc) {
            return "Customer RFC is required";
        }
        if (!branch || !(0, helpers_1.isValidBranch)(branch)) {
            return "Branch is required and must be valid";
        }
        if (!docNumber) {
            return "Document number is required";
        }
        if (!payment_method || !(0, helpers_1.isValidPaymentMethod)(payment_method)) {
            return "Payment method is required";
        }
        if (data)
            return undefined;
    }
}
exports.BillCreationInfoDTO = BillCreationInfoDTO;
