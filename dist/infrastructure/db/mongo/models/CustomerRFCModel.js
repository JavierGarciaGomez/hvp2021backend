"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const customerRFCSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    rfc: { type: String, required: true },
    invoice_usage: { type: String, required: true },
    fiscal_regime: { type: String, required: true },
    postal_code: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    isValidated: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
}, { timestamps: true });
const CustomerRFCModel = (0, mongoose_1.model)("CustomerRFC", customerRFCSchema);
exports.default = CustomerRFCModel;
