import { createTimeOffRequestService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { TimeOffRequestController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

export class TimeOffRequestRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createTimeOffRequestService();
    const controller = new TimeOffRequestController(service);

    this.router.get(
      "/collaborators/time-off-overview/:id",
      AuthMiddleware.validateJWT,
      controller.getCollaboratorTimeOffOverview
    );

    this.router.get(
      "/collaborators/time-off-overview",
      AuthMiddleware.validateJWT,
      controller.getCollaboratorsTimeOffOverview
    );

    this.setupCrudRoutes(controller);
  }
}
