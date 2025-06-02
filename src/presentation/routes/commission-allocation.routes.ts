import { createCommissionAllocationService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { CommissionAllocationController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

export class CommissionAllocationRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createCommissionAllocationService();
    const controller = new CommissionAllocationController(service);

    this.router.use(AuthMiddleware.validateJWT);

    this.router.get("/stats", controller.getCommissionsStats);

    this.setupCrudRoutes(controller);
  }
}
