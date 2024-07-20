import { Router } from "express";

import { AuthActivitiesService } from "./authActivitiesService";
import { AuthActivitiesController } from "./authActivitiesController";
import { AuthMiddleware } from "../../middlewares";

export const routes = {
  list: "/",
  byId: "/:id",
  byUserId: "/user/:id",
};

export class AuthActivitiesRoutes {
  static get routes(): Router {
    const router = Router();
    const service = new AuthActivitiesService();
    const controller = new AuthActivitiesController(service);

    router.use(AuthMiddleware.validateJWT);

    router.get(routes.list, controller.list);
    router.get(routes.byId, controller.byId);
    router.get(routes.byUserId, controller.byUserId);

    return router;
  }
}
