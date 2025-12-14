import { Router, Request, Response, NextFunction } from "express";
import { AuthMiddleware, authorizationMiddleware } from "../middlewares";
import { BaseController } from "../controllers";
import { BaseEntity, WebAppRole } from "../../domain";
import { BaseDTO } from "../../application";

export abstract class BaseCRUDRoutes {
  protected router: Router;

  constructor() {
    this.router = Router();
    this.initializeRoutes();
  }

  protected abstract initializeRoutes(): void;

  public getRoutes(): Router {
    return this.router;
  }

  protected setupCrudRoutes<T extends BaseEntity, DTO extends BaseDTO, R = T>(
    controller: BaseController<T, DTO, R>
  ) {
    this.router.delete(
      "/bulk",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin],
      }),
      controller.deleteMany
    );
    this.router.post(
      "/bulk",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin],
      }),
      controller.createMany
    );
    this.router.get("/", AuthMiddleware.validateJWT, controller.getAll);
    this.router.get("/:id", AuthMiddleware.validateJWT, controller.getById);
    this.router.post("/", AuthMiddleware.validateJWT, controller.create);
    this.router.patch("/:id", AuthMiddleware.validateJWT, controller.update);
    this.router.delete("/:id", AuthMiddleware.validateJWT, controller.delete);
    this.router.patch(
      "/",
      AuthMiddleware.validateJWT,
      authorizationMiddleware({
        roles: [WebAppRole.admin],
      }),
      controller.updateMany
    );
  }
}
