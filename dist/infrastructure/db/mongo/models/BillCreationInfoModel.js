"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shared_1 = require("../../../../shared");
const billCreationInfoSchema = new mongoose_1.Schema({
    bill_date: { type: Date, required: true },
    customer_rfc: { type: mongoose_1.Schema.Types.ObjectId, ref: "CustomerRFC" },
    branch: {
        type: String,
        enum: Object.values(shared_1.Branch),
        default: shared_1.Branch.Urban,
    },
    document_number: { type: String, required: true },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    is_documented: { type: Boolean, default: false },
    payment_method: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
}, { timestamps: true });
const billCreationInfoModel = (0, mongoose_1.model)("BillCreationInfo", billCreationInfoSchema);
exports.default = billCreationInfoModel;
