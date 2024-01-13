"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestsRoutes = exports.TimeOffRequestsRoutePaths = void 0;
const express_1 = require("express");
// import { AuthMiddleware } from "../middlewares/auth.middleware";
// import { CategoryService } from "../services/category.service";
const timeOffRequestsController_1 = require("./timeOffRequestsController");
const timeOffRequestsService_1 = require("./timeOffRequestsService");
const Collaborator_1 = require("../../../models/Collaborator");
const isAuthorized_1 = __importDefault(require("../../../middlewares/isAuthorized"));
const validateJwt_1 = require("../../../middlewares/validateJwt");
var TimeOffRequestsRoutePaths;
(function (TimeOffRequestsRoutePaths) {
    TimeOffRequestsRoutePaths["all"] = "/";
    TimeOffRequestsRoutePaths["byCollaborator"] = "/collaborator/:collaboratorId";
    TimeOffRequestsRoutePaths["byYear"] = "/year/:year";
    TimeOffRequestsRoutePaths["byId"] = "/:id";
    TimeOffRequestsRoutePaths["collaboratorsOverview"] = "/collaborators/time-off-overview";
    TimeOffRequestsRoutePaths["collaboratorOverview"] = "/collaborators/time-off-overview/:collaboratorId";
    TimeOffRequestsRoutePaths["create"] = "/";
    TimeOffRequestsRoutePaths["update"] = "/:id";
    TimeOffRequestsRoutePaths["approve"] = "/:id/approve";
    TimeOffRequestsRoutePaths["delete"] = "/:id";
})(TimeOffRequestsRoutePaths || (exports.TimeOffRequestsRoutePaths = TimeOffRequestsRoutePaths = {}));
class TimeOffRequestsRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const service = new timeOffRequestsService_1.TimeOffRequestsService();
        const controller = new timeOffRequestsController_1.TimeOffRequestController(service);
        router.use(validateJwt_1.validateJwt);
        // Definir las rutas
        router.get(TimeOffRequestsRoutePaths.all, controller.getTimeOffRequests);
        router.get(TimeOffRequestsRoutePaths.byCollaborator, controller.getTimeOffRequestsByCollaborator);
        router.get(TimeOffRequestsRoutePaths.byYear, controller.getTimeOffRequestsByYear);
        router.get(TimeOffRequestsRoutePaths.byId, controller.getTimeOffRequestById);
        router.post(TimeOffRequestsRoutePaths.create, controller.createTimeOffRequest);
        router.put(TimeOffRequestsRoutePaths.update, (0, isAuthorized_1.default)([Collaborator_1.CollaboratorRole.admin, Collaborator_1.CollaboratorRole.manager], true), controller.updateTimeOffRequest);
        router.patch(TimeOffRequestsRoutePaths.approve, (0, isAuthorized_1.default)([Collaborator_1.CollaboratorRole.admin, Collaborator_1.CollaboratorRole.manager]), controller.approveTimeOffRequest);
        router.delete(TimeOffRequestsRoutePaths.delete, (0, isAuthorized_1.default)([Collaborator_1.CollaboratorRole.admin, Collaborator_1.CollaboratorRole.manager], true), controller.deleteTimeOffRequest);
        router.get(TimeOffRequestsRoutePaths.collaboratorsOverview, controller.getCollaboratorsTimeOffOverview);
        router.get(TimeOffRequestsRoutePaths.collaboratorOverview, controller.getCollaboratorTimeOffOverview);
        // router.post("/", [AuthMiddleware.validateJWT], controller.createCategory);
        return router;
    }
}
exports.TimeOffRequestsRoutes = TimeOffRequestsRoutes;
