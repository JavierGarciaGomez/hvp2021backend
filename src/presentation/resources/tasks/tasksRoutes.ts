import { Router } from "express";

// import { AuthMiddleware } from "../middlewares/auth.middleware";
// import { CategoryService } from "../services/category.service";
import { TasksController } from "./tasksController";
import { TasksService } from "./tasksService";
import { CollaboratorRole } from "../../../models/Collaborator";
import isAuthorized from "../../../middlewares/isAuthorized";
const { validateJwt } = require("../../../middlewares/validateJwt");

export enum TasksPaths {
  all = "/",
  byCollaborator = "/collaborator/:collaboratorId",
  byId = "/:id",
  create = "/",
  update = "/:id",
  approve = "/:id/approve",
  delete = "/:id",
}

export class TasksRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new TasksService();
    const controller = new TasksController(service);

    router.use(validateJwt);

    // Definir las rutas
    router.get(TasksPaths.all, controller.getTasks);
    router.get(TasksPaths.byCollaborator, controller.getTasksByCollaborator);

    router.get(TasksPaths.byId, controller.getTasksById);

    router.post(TasksPaths.create, controller.createTask);
    router.put(TasksPaths.update, controller.updateTask);

    router.delete(
      TasksPaths.delete,
      isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager]),
      controller.deleteTask
    );

    // router.post("/", [AuthMiddleware.validateJWT], controller.createCategory);

    return router;
  }
}
