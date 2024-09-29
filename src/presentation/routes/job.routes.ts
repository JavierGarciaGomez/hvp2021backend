import { createJobService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { JobController } from "../controllers";
import { authorizedRolesMiddleware } from "../middlewares/auhotirzed-roles.middleware";
import { WebAppRole } from "../../domain";
import { AuthMiddleware } from "../middlewares";

export class JobRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const productService = createJobService();
    const controller = new JobController(productService);

    this.router.get("/payment-types", controller.getPaymentTypes);
    this.router.post(
      "/",
      AuthMiddleware.validateJWT,
      authorizedRolesMiddleware([WebAppRole.admin]),
      controller.create
    );
    this.router.patch(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizedRolesMiddleware([WebAppRole.admin]),
      controller.update
    );
    this.router.delete(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizedRolesMiddleware([WebAppRole.admin]),
      controller.delete
    );
    this.setupCrudRoutes(controller);
  }
}
