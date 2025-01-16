import { createSaleService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { SaleController } from "../controllers";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";

export class SaleRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createSaleService();
    const controller = new SaleController(service);

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
