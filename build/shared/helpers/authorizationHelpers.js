"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isManagerOrAdmin = void 0;
const domain_1 = require("../../domain");
const isManagerOrAdmin = (role) => {
    return role === domain_1.CollaboratorRole.manager || role === domain_1.CollaboratorRole.admin;
};
exports.isManagerOrAdmin = isManagerOrAdmin;
