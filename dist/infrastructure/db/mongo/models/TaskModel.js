"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shared_1 = require("../../../../shared");
const taskSchema = new mongoose_1.Schema({
    activities: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "TaskActivity" }],
    assignees: [{ type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" }],
    author: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    completedAt: { type: Date },
    completionCriteria: [{ type: String }],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    description: { type: String },
    dueDate: { type: Date },
    isRestrictedView: {
        type: Boolean,
        default: false,
    },
    notes: { type: String },
    number: { type: Number },
    priority: {
        type: String,
        enum: Object.values(shared_1.TaskPriority),
        default: shared_1.TaskPriority.Low,
    },
    requestedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: Object.values(shared_1.TaskStatus),
        default: shared_1.TaskStatus.Backlog,
    },
    tags: [{ type: String, enum: Object.values(shared_1.TaskTag) }],
    title: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
}, { timestamps: true });
// Pre-save middleware to assign consecutive number
taskSchema.pre("save", function (next) {
    return __awaiter(this, void 0, void 0, function* () {
        const currentTask = this;
        if (!currentTask.number) {
            try {
                const lastTask = yield TaskModel.findOne({}, {}, { sort: { number: -1 } });
                currentTask.number = ((lastTask === null || lastTask === void 0 ? void 0 : lastTask.number) || 0) + 1;
            }
            catch (error) {
                next(error);
            }
        }
        next();
    });
});
const TaskModel = (0, mongoose_1.model)("Task", taskSchema);
exports.default = TaskModel;
