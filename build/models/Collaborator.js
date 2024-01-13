"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorRole = void 0;
// 339
const mongoose_1 = require("mongoose");
var CollaboratorRole;
(function (CollaboratorRole) {
    CollaboratorRole["admin"] = "Administrador";
    CollaboratorRole["manager"] = "Gerente";
    CollaboratorRole["collaborator"] = "Colaborador";
    CollaboratorRole["user"] = "User";
    CollaboratorRole["guest"] = "Invitado";
})(CollaboratorRole || (exports.CollaboratorRole = CollaboratorRole = {}));
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
        enum: CollaboratorRole,
        default: CollaboratorRole.collaborator,
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
        default: false,
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
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Collaborator",
    },
});
const CollaboratorModel = (0, mongoose_1.model)("Collaborator", CollaboratorSchema);
exports.default = CollaboratorModel;
