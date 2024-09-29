"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const enums_1 = require("../../../../domain/enums");
const domain_1 = require("../../../../domain");
const CollaboratorSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: enums_1.Gender,
        required: false,
    },
    email: {
        type: String,
        required: false,
    },
    phoneNumber: {
        type: String,
        required: false,
    },
    phoneNumber2: {
        type: String,
        required: false,
    },
    address: domain_1.AddressSchema,
    curp: {
        type: String,
        required: false,
    },
    imssNumber: {
        type: String,
        required: false,
    },
    rfcCode: {
        type: String,
        required: false,
    },
    emergencyContact: {
        type: String,
        required: false,
    },
    emergencyContactPhone: {
        type: String,
        required: false,
    },
    role: {
        type: String,
        enum: enums_1.WebAppRole,
        default: enums_1.WebAppRole.collaborator,
    },
    imgUrl: {
        type: String,
    },
    accessCode: {
        type: String,
    },
    isRegistered: {
        type: Boolean,
    },
    password: {
        type: String,
    },
    isDisplayedWeb: {
        type: Boolean,
        default: true,
    },
    textPresentation: {
        type: String,
        defaut: "",
    },
    registeredDate: {
        type: Date,
        default: Date.now,
        required: true,
    },
    lastLogin: {
        type: Date,
    },
    vacationsTakenBefore2021: {
        type: Number,
    },
    col_code: {
        type: String,
        required: true,
    },
    col_numId: {
        type: Number,
        required: false,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    position: {
        type: String,
    },
    coverShift: {
        type: Boolean,
    },
    weeklyHours: {
        type: Number,
    },
    jobId: {
        type: String,
    },
    contractDate: {
        type: Date,
    },
    hasIMSS: {
        type: Boolean,
    },
    imssEnrollmentDate: {
        type: Date,
    },
    paymentType: {
        type: String,
        enum: enums_1.PaymentType,
    },
    additionalCompensation: {
        type: Number,
    },
    degree: {
        type: String,
        enum: enums_1.Degree,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
}, {
    timestamps: true,
});
exports.CollaboratorModel = mongoose_1.default.model("Collaborator", CollaboratorSchema);
