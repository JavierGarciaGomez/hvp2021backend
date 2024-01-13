"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TasksRoutes = exports.TasksPaths = void 0;
const express_1 = require("express");
const tasksController_1 = require("./tasksController");
const tasksService_1 = require("./tasksService");
const Collaborator_1 = require("../../../models/Collaborator");
const isAuthorized_1 = __importDefault(require("../../../middlewares/isAuthorized"));
const { validateJwt } = require("../../../middlewares/validateJwt");
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
        const service = new tasksService_1.TasksService();
        const controller = new tasksController_1.TasksController(service);
        router.use(validateJwt);
        // Definir las rutas
        router.get(TasksPaths.all, controller.getTasks);
        router.get(TasksPaths.byCollaborator, controller.getTasksByCollaborator);
        router.get(TasksPaths.byId, controller.getTasksById);
        router.post(TasksPaths.create, controller.createTask);
        router.put(TasksPaths.update, controller.updateTask);
        router.delete(TasksPaths.delete, (0, isAuthorized_1.default)([Collaborator_1.CollaboratorRole.admin, Collaborator_1.CollaboratorRole.manager]), controller.deleteTask);
        return router;
    }
}
exports.TasksRoutes = TasksRoutes;
