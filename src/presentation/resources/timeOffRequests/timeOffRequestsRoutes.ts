import { Router } from "express";

// import { AuthMiddleware } from "../middlewares/auth.middleware";
// import { CategoryService } from "../services/category.service";
import { TimeOffRequestController } from "./timeOffRequestsController";
import { TimeOffRequestsService } from "./timeOffRequestsService";
const { validateJwt } = require("../../../middlewares/validateJwt");

export enum TimeOffRoutes {
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
    router.get("/", controller.getTimeOffRequests);
    // router.post("/", [AuthMiddleware.validateJWT], controller.createCategory);

    return router;
  }
}
