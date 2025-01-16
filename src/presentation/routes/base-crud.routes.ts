import { Router, Request, Response, NextFunction } from "express";
import { AuthMiddleware } from "../middlewares";
import { BaseController } from "../controllers";
import { BaseEntity } from "../../domain";
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
      controller.deleteMany
    );
    this.router.post(
      "/bulk",
      AuthMiddleware.validateJWT,
      controller.createMany
    );
    this.router.get("/", AuthMiddleware.validateJWT, controller.getAll);
    this.router.get("/:id", AuthMiddleware.validateJWT, controller.getById);
    this.router.post("/", AuthMiddleware.validateJWT, controller.create);
    this.router.patch("/:id", AuthMiddleware.validateJWT, controller.update);
    this.router.delete("/:id", AuthMiddleware.validateJWT, controller.delete);
    this.router.patch("/", AuthMiddleware.validateJWT, controller.updateMany);
  }
}
