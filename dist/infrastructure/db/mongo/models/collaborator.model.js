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
const CollaboratorSchema = new mongoose_1.Schema({
    first_name: {
        type: String,
        required: true,
    },
    last_name: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: enums_1.CollaboratorRole,
        default: enums_1.CollaboratorRole.collaborator,
    },
    col_code: {
        type: String,
        required: true,
    },
    col_numId: {
        type: Number,
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    gender: {
        type: String,
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
    email: {
        type: String,
    },
    password: {
        type: String,
    },
    position: {
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
    // VacationDays
    startDate: {
        type: Date,
    },
    endDate: {
        type: Date,
    },
    vacationsTakenBefore2021: {
        type: Number,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
}, {
    timestamps: true,
});
exports.CollaboratorModel = mongoose_1.default.model("Collaborator", CollaboratorSchema);
