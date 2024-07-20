import { CollaboratorController } from "./../controllers";

import {
  CollaboratorRepositoryImpl,
  CollaboratorDataSourceMongoImp,
} from "../../infrastructure";
import { CollaboratorService } from "../../application";
import { AuthMiddleware } from "../middlewares";
import { BaseCRUDRoutes } from "./base-crud.routes";

export class CollaboratorRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const datasource = new CollaboratorDataSourceMongoImp();
    const repository = new CollaboratorRepositoryImpl(datasource);
    const service = new CollaboratorService(repository);
    const controller = new CollaboratorController(service);

    this.setupCrudRoutes(controller);
    this.router.patch("/register", controller.register);
    this.router.get("/getAllForWeb", controller.getAllPublic);
    // todo this should be removed
    this.router.post("/create", AuthMiddleware.validateJWT, controller.create);
  }
}
