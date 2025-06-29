import {
  ActivityRegisterService,
  createActivityRegisterService,
} from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { ActivityRegisterController } from "../controllers";
import { AuthMiddleware, ownerOrManagerMiddleware } from "../middlewares";

export class ActivityRegisterRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createActivityRegisterService();
    const controller = new ActivityRegisterController(service);

    this.setupCustomCrudRoutes(controller, service);
    this.setupCrudRoutes(controller);
  }

  protected setupCustomCrudRoutes(
    controller: ActivityRegisterController,
    service: ActivityRegisterService
  ) {
    // Setup other routes using the base method

    // Override the update route with a custom middleware
    this.router.patch(
      "/:id",
      AuthMiddleware.validateJWT,
      ownerOrManagerMiddleware(service),
      controller.update
    );

    this.router.get(
      "/calculate-duration",
      AuthMiddleware.validateJWT,
      controller.calculateDuration
    );

    this.router.get(
      "/collaborator/:collaboratorId/calculate-duration",
      AuthMiddleware.validateJWT,
      controller.calculateCollaboratorDuration
    );
  }
}
