import { createBranchCashReconciliationService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { BranchCashReconciliationController } from "../controllers";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";

export class BranchCashReconciliationRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createBranchCashReconciliationService();
    const controller = new BranchCashReconciliationController(service);

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
