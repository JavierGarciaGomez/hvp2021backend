import { Router } from "express";
import { TimeOffRequestController } from "./timeOffRequestsController";
import { TimeOffRequestsService } from "./timeOffRequestsService";
import { WebAppRole } from "../../../domain";
import { AuthMiddleware } from "../../middlewares";
import isAuthorized from "../../middlewares/isAuthorized";
import { createNotificationService } from "../../../application";

export enum TimeOffRequestsRoutePaths {
  all = "/",
  byCollaborator = "/collaborator/:collaboratorId",
  byYear = "/year/:year",
  byId = "/:id",
  collaboratorsOverview = "/collaborators/time-off-overview",
  collaboratorOverview = "/collaborators/time-off-overview/:collaboratorId",
  create = "/",
  update = "/:id",
  approve = "/:id/approve",
  delete = "/:id",
}

export class TimeOffRequestsRoutes {
  static get routes(): Router {
    const router = Router();

    const notificationService = createNotificationService();

    const service = new TimeOffRequestsService(notificationService);
    const controller = new TimeOffRequestController(service);

    router.use(AuthMiddleware.validateJWT);

    // Definir las rutas
    router.get(TimeOffRequestsRoutePaths.all, controller.getTimeOffRequests);
    router.get(
      TimeOffRequestsRoutePaths.byCollaborator,
      controller.getTimeOffRequestsByCollaborator
    );
    router.get(
      TimeOffRequestsRoutePaths.byYear,
      controller.getTimeOffRequestsByYear
    );

    router.get(
      TimeOffRequestsRoutePaths.byId,
      controller.getTimeOffRequestById
    );

    router.post(
      TimeOffRequestsRoutePaths.create,
      controller.createTimeOffRequest
    );
    router.put(
      TimeOffRequestsRoutePaths.update,
      isAuthorized([WebAppRole.admin, WebAppRole.manager], true),
      controller.updateTimeOffRequest
    );
    router.patch(
      TimeOffRequestsRoutePaths.approve,
      isAuthorized([WebAppRole.admin, WebAppRole.manager]),
      controller.approveTimeOffRequest
    );
    router.delete(
      TimeOffRequestsRoutePaths.delete,
      isAuthorized([WebAppRole.admin, WebAppRole.manager], true),
      controller.deleteTimeOffRequest
    );
    router.get(
      TimeOffRequestsRoutePaths.collaboratorsOverview,
      controller.getCollaboratorsTimeOffOverview
    );
    router.get(
      TimeOffRequestsRoutePaths.collaboratorOverview,
      controller.getCollaboratorTimeOffOverview
    );

    // router.post("/", [AuthMiddleware.validateJWT], controller.createCategory);

    return router;
  }
}
