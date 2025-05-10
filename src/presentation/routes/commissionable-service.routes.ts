import { createCommissionableServiceService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { CommissionableServiceController } from "../controllers";
import { AuthMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";
import { authorizedRolesMiddleware } from "../middlewares/auhotirzed-roles.middleware";

export class CommissionableServiceRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createCommissionableServiceService();
    const controller = new CommissionableServiceController(service);

    this.router.use(AuthMiddleware.validateJWT);
    this.router.use(authorizedRolesMiddleware([WebAppRole.admin]));

    this.setupCrudRoutes(controller);
  }
}
