import { CollaboratorController } from "./../controllers";

import {
  CollaboratorRepositoryImpl,
  CollaboratorDataSourceMongoImp,
} from "../../infrastructure";
import { CollaboratorService } from "../../application";
import { AuthMiddleware } from "../middlewares";
import { BaseCRUDRoutes } from "./base-crud.routes";
import isAuthorized from "../middlewares/isAuthorized";
import { WebAppRole } from "../../domain";
import { authorizationMiddleware } from "../middlewares/authorization.middleware";

export class CollaboratorRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const datasource = new CollaboratorDataSourceMongoImp();
    const repository = new CollaboratorRepositoryImpl(datasource);
    const service = new CollaboratorService(repository);
    const controller = new CollaboratorController(service);

    this.router.get("/getAllForWeb", controller.getAllPublic);
    this.router.delete(
      "/:id",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin],
      }),
      controller.delete
    );
    this.router.patch("/register", controller.register);
    // todo this should be removed
    this.router.post(
      "/create",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin, WebAppRole.manager],
      }),
      controller.create
    );
    this.setupCrudRoutes(controller);
  }
}
