"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRoutes = exports.TasksPaths = void 0;
const express_1 = require("express");
const tasksController_1 = require("./tasksController");
const tasksService_1 = require("./tasksService");
const application_1 = require("../../../application");
const infrastructure_1 = require("../../../infrastructure");
const domain_1 = require("../../../domain");
const middlewares_1 = require("../../middlewares");
const isAuthorized_1 = __importDefault(require("../../middlewares/isAuthorized"));
var TasksPaths;
(function (TasksPaths) {
    TasksPaths["all"] = "/";
    TasksPaths["byCollaborator"] = "/collaborator/:collaboratorId";
    TasksPaths["byId"] = "/:id";
    TasksPaths["create"] = "/";
    TasksPaths["update"] = "/:id";
    TasksPaths["approve"] = "/:id/approve";
    TasksPaths["delete"] = "/:id";
})(TasksPaths || (exports.TasksPaths = TasksPaths = {}));
class TasksRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const notificationDatasource = new infrastructure_1.NotificationDataSourceMongoImp();
        const notificationRepository = new infrastructure_1.NotificationRepositoryImpl(notificationDatasource);
        const notificationService = new application_1.NotificationService(notificationRepository);
        const service = new tasksService_1.TasksService(notificationService);
        const controller = new tasksController_1.TasksController(service);
        router.use(middlewares_1.AuthMiddleware.validateJWT);
        // Definir las rutas
        router.get(TasksPaths.all, controller.getTasks);
        router.get(TasksPaths.byCollaborator, controller.getTasksByCollaborator);
        router.get(TasksPaths.byId, controller.getTasksById);
        router.post(TasksPaths.create, controller.createTask);
        router.put(TasksPaths.update, controller.updateTask);
        router.delete(TasksPaths.delete, (0, isAuthorized_1.default)([domain_1.WebAppRole.admin, domain_1.WebAppRole.manager]), controller.deleteTask);
        return router;
    }
}
exports.TasksRoutes = TasksRoutes;
