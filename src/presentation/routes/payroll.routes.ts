import { createPayrollService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { PayrollController } from "../controllers";
import { AuthMiddleware } from "../middlewares";

export class PayrollRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createPayrollService();
    const controller = new PayrollController(service);

    this.router.get(
      "/estimates",
      AuthMiddleware.validateJWT,
      controller.getPayrollEstimates
    );

    this.router.get(
      "/estimates/:collaboratorId",
      AuthMiddleware.validateJWT,
      controller.getPayrollEstimateByCollaboratorId
    );

    this.setupCrudRoutes(controller);
  }
}
