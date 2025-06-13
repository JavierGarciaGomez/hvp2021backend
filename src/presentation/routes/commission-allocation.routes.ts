import { createCommissionAllocationService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { CommissionAllocationController } from "../controllers";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";

export class CommissionAllocationRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createCommissionAllocationService();
    const controller = new CommissionAllocationController(service);

    this.router.use(AuthMiddleware.validateJWT);

    this.router.get(
      "/stats",
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.getCommissionsStats
    );
    this.router.get(
      "/promotion-stats",
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.getCommissionPromotionStats
    );

    this.setupCrudRoutes(controller);
  }
}
