import { Router } from "express";
import { TasksController } from "./tasksController";
import { TasksService } from "./tasksService";
import { NotificationService } from "../../../application";
import {
  NotificationDataSourceMongoImp,
  NotificationRepositoryImpl,
} from "../../../infrastructure";
import { WebAppRole } from "../../../domain";
import { AuthMiddleware } from "../../middlewares";
import isAuthorized from "../../middlewares/isAuthorized";

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

    const notificationDatasource = new NotificationDataSourceMongoImp();
    const notificationRepository = new NotificationRepositoryImpl(
      notificationDatasource
    );
    const notificationService = new NotificationService(notificationRepository);
    const service = new TasksService(notificationService);

    const controller = new TasksController(service);

    router.use(AuthMiddleware.validateJWT);

    // Definir las rutas
    router.get(TasksPaths.all, controller.getTasks);
    router.get(TasksPaths.byCollaborator, controller.getTasksByCollaborator);

    router.get(TasksPaths.byId, controller.getTasksById);

    router.post(TasksPaths.create, controller.createTask);
    router.put(TasksPaths.update, controller.updateTask);

    router.delete(
      TasksPaths.delete,
      isAuthorized([WebAppRole.admin, WebAppRole.manager]),
      controller.deleteTask
    );

    return router;
  }
}
