import { Router } from "express";

import { WorkLogsController } from "./workLogsController";
import { WorkLogsService } from "./workLogsService";
import { CollaboratorRole } from "../../../data/models/CollaboratorModel";
import isAuthorized from "../../../middlewares/isAuthorized";
import { AuthMiddleware } from "../../../middlewares";
const { validateJwt } = require("../../../middlewares/validateJwt");

export enum WorkLogsPaths {
  all = "/",
  byCollaborator = "/collaborator/:collaboratorId",
  byId = "/:id",
  create = "/",
  update = "/:id",
  approve = "/:id/approve",
  delete = "/:id",
}

export class WorkLogsRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new WorkLogsService();
    const controller = new WorkLogsController(service);

    router.use(AuthMiddleware.validateJWT);

    // Definir las rutas
    router.get(WorkLogsPaths.all, controller.getWorkLogs);
    router.get(
      WorkLogsPaths.byCollaborator,
      controller.getWorkLogsByCollaborator
    );

    router.get(WorkLogsPaths.byId, controller.getWorkLogById);

    router.post(WorkLogsPaths.create, controller.createWorkLog);
    router.put(WorkLogsPaths.update, controller.updateWorkLog);

    router.delete(
      WorkLogsPaths.delete,
      isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager]),
      controller.deleteWorkLog
    );

    return router;
  }
}
