"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.WorkLogsRoutes = exports.WorkLogsPaths = void 0;
const express_1 = require("express");
const workLogsController_1 = require("./workLogsController");
const workLogsService_1 = require("./workLogsService");
const domain_1 = require("../../../domain");
const middlewares_1 = require("../../middlewares");
const isAuthorized_1 = __importDefault(require("../../middlewares/isAuthorized"));
var WorkLogsPaths;
(function (WorkLogsPaths) {
    WorkLogsPaths["all"] = "/";
    WorkLogsPaths["byCollaborator"] = "/collaborator/:collaboratorId";
    WorkLogsPaths["byId"] = "/:id";
    WorkLogsPaths["create"] = "/";
    WorkLogsPaths["update"] = "/:id";
    WorkLogsPaths["approve"] = "/:id/approve";
    WorkLogsPaths["delete"] = "/:id";
})(WorkLogsPaths || (exports.WorkLogsPaths = WorkLogsPaths = {}));
class WorkLogsRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const service = new workLogsService_1.WorkLogsService();
        const controller = new workLogsController_1.WorkLogsController(service);
        router.use(middlewares_1.AuthMiddleware.validateJWT);
        // Definir las rutas
        router.get(WorkLogsPaths.all, controller.getWorkLogs);
        router.get(WorkLogsPaths.byCollaborator, controller.getWorkLogsByCollaborator);
        router.get(WorkLogsPaths.byId, controller.getWorkLogById);
        router.post(WorkLogsPaths.create, controller.createWorkLog);
        router.put(WorkLogsPaths.update, controller.updateWorkLog);
        router.delete(WorkLogsPaths.delete, (0, isAuthorized_1.default)([domain_1.CollaboratorRole.admin, domain_1.CollaboratorRole.manager]), controller.deleteWorkLog);
        return router;
    }
}
exports.WorkLogsRoutes = WorkLogsRoutes;
