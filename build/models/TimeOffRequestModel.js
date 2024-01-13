"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const timeOffTypes_1 = require("../data/types/timeOffTypes");
const timeOffRequestSchema = new mongoose_1.Schema({
    approvedAt: { type: Date },
    approvedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Collaborator",
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
        enum: Object.values(timeOffTypes_1.TimeOffStatus),
        default: timeOffTypes_1.TimeOffStatus.pending,
    },
    timeOffType: {
        type: String,
        enum: Object.values(timeOffTypes_1.TimeOffType),
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
