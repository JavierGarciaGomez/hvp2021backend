import { createAccountService } from "../../application";
import { BaseCRUDRoutes } from "./base-crud.routes";
import { AccountController } from "../controllers";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { WebAppRole } from "../../domain";

export class AccountRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const service = createAccountService();
    const controller = new AccountController(service);

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
