"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shared_1 = require("../../../../shared");
const authActivitySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    activity: {
        type: String,
        enum: Object.values(shared_1.AuthActivityType),
        required: true,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "Collaborator" },
}, { timestamps: true });
const AuthActivityModel = (0, mongoose_1.model)("AuthActivity", authActivitySchema);
exports.default = AuthActivityModel;
