import { Router, Request, Response, NextFunction } from "express";
import { AuthMiddleware } from "../middlewares";

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

  protected setupCrudRoutes(controller: any) {
    this.router.get("/", AuthMiddleware.validateJWT, controller.getAll);
    this.router.get("/:id", AuthMiddleware.validateJWT, controller.getById);
    this.router.post("/", AuthMiddleware.validateJWT, controller.create);
    this.router.patch("/:id", AuthMiddleware.validateJWT, controller.update);
    this.router.delete("/:id", AuthMiddleware.validateJWT, controller.delete);
  }
}
