"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const workLogSchema = new mongoose_1.Schema({
    activities: [
        {
            content: String,
            relatedTask: { type: mongoose_1.Schema.Types.ObjectId, ref: "Task" },
            relatedTaskActivity: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: "TaskActivity",
            },
            createdAt: { type: Date, default: Date.now },
            createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
            updatedAt: { type: Date, default: Date.now },
            updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
        },
    ],
    logDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
}, { timestamps: true });
const WorkLogModel = (0, mongoose_1.model)("WorkLog", workLogSchema);
exports.default = WorkLogModel;
