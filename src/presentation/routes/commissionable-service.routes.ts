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

    this.router.get(
      "/commission-calculation",
      controller.getCommissionCalculation
    );

    this.router.get("/", controller.getAll);
    this.router.get("/:id", controller.getById);
    this.router.post(
      "/",
      authorizedRolesMiddleware([WebAppRole.admin]),
      controller.create
    );
    this.router.put(
      "/:id",
      authorizedRolesMiddleware([WebAppRole.admin]),
      controller.update
    );
    this.setupCrudRoutes(controller);
  }
}
