"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shared_1 = require("../../shared");
// TODO: DELETE? This is repaeted with other model
const timeOffRequestSchema = new mongoose_1.Schema({
    approvedAt: { type: Date },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Collaborator",
        required: false,
    },
    collaborator: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Collaborator",
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Collaborator",
    },
    collaboratorNote: { type: String },
    managerNote: { type: String },
    requestedAt: { type: Date, default: Date.now },
    requestedDays: { type: [Date], required: true },
    status: {
        type: String,
        enum: Object.values(shared_1.TimeOffStatus),
        default: shared_1.TimeOffStatus.Pending,
    },
    timeOffType: {
        type: String,
        enum: Object.values(shared_1.TimeOffType),
        required: true,
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Collaborator",
    },
}, { timestamps: true });
const TimeOffRequestModel = (0, mongoose_1.model)("TimeOffRequest", timeOffRequestSchema);
exports.default = TimeOffRequestModel;
