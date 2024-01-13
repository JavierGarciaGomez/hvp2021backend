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
const fetchHelpers_1 = require("../helpers/fetchHelpers");
const errorHandler_1 = require("./errorHandler");
const BaseError_1 = require("../domain/errors/BaseError");
const isAuthorized = (allowedRoles = [], collaboratorCanUpdate = false) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { role: collaboratorRole, uid } = req.authenticatedCollaborator;
    const id = req.params.id;
    const resource = yield (0, fetchHelpers_1.getResource)(req.baseUrl, id);
    if (!resource) {
        const error = BaseError_1.BaseError.notFound(`Resource not found with id ${id}`);
        (0, errorHandler_1.errorHandler)(error, req, res, next);
    }
    const hasAllowedRole = allowedRoles.includes(collaboratorRole);
    const isCollaborator = collaboratorCanUpdate && resource.collaborator.toString() === uid;
    if (hasAllowedRole || (isCollaborator && collaboratorCanUpdate)) {
        next();
    }
    else {
        const error = BaseError_1.BaseError.unauthorized("You are not authorized to perform this action");
        (0, errorHandler_1.errorHandler)(error, req, res, next);
    }
});
exports.default = isAuthorized;
