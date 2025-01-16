import { createSimplifiedBranchCashReconciliationService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { SimplifiedBranchCashReconciliationController } from "../controllers";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";

export class SimplifiedBranchCashReconciliationRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createSimplifiedBranchCashReconciliationService();
    const controller = new SimplifiedBranchCashReconciliationController(
      service
    );

    this.router.post(
      "/",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.create
    );

    this.router.patch(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.update
    );

    this.router.delete(
      "/bulk",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.deleteMany
    );

    this.router.delete(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.delete
    );

    this.setupCrudRoutes(controller);
  }
}
