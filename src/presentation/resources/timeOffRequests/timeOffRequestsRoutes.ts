import { Router } from "express";

// import { AuthMiddleware } from "../middlewares/auth.middleware";
// import { CategoryService } from "../services/category.service";
import { TimeOffRequestController } from "./timeOffRequestsController";
import { TimeOffRequestsService } from "./timeOffRequestsService";
import { CollaboratorRole } from "../../../data/models/CollaboratorModel";
import isAuthorized from "../../../middlewares/isAuthorized";
import { validateJwt } from "../../../middlewares/validateJwt";

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
    const service = new TimeOffRequestsService();
    const controller = new TimeOffRequestController(service);

    router.use(validateJwt);

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
      isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager], true),
      controller.updateTimeOffRequest
    );
    router.patch(
      TimeOffRequestsRoutePaths.approve,
      isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager]),
      controller.approveTimeOffRequest
    );
    router.delete(
      TimeOffRequestsRoutePaths.delete,
      isAuthorized([CollaboratorRole.admin, CollaboratorRole.manager], true),
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
