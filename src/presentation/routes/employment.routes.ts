import { createEmploymentService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { EmploymentController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

export class EmploymentRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createEmploymentService();
    const controller = new EmploymentController(service);

    // Custom route for creating draft employments
    this.router.get(
      "/draft",
      AuthMiddleware.validateJWT,
      controller.createDraftEmployments
    );

    // Custom route for creating draft employment for a single collaborator
    this.router.get(
      "/draft/:collaboratorId",
      AuthMiddleware.validateJWT,
      controller.createDraftEmploymentForCollaborator
    );

    // Custom route for creating multiple employments
    this.router.post(
      "/bulk",
      AuthMiddleware.validateJWT,
      controller.createMany
    );

    // Custom route for recalculating employment values
    this.router.post(
      "/recalculate",
      AuthMiddleware.validateJWT,
      controller.recalculateEmployment
    );

    // Custom route for recalculating multiple employment values
    this.router.post(
      "/recalculate-bulk",
      AuthMiddleware.validateJWT,
      controller.recalculateEmployments
    );

    this.setupCrudRoutes(controller);
  }
}
