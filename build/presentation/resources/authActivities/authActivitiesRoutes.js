"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthActivitiesRoutes = exports.routes = void 0;
const express_1 = require("express");
const authActivitiesService_1 = require("./authActivitiesService");
const authActivitiesController_1 = require("./authActivitiesController");
const middlewares_1 = require("../../middlewares");
exports.routes = {
    list: "/",
    byId: "/:id",
    byUserId: "/user/:id",
};
class AuthActivitiesRoutes {
    static get routes() {
        const router = (0, express_1.Router)();
        const service = new authActivitiesService_1.AuthActivitiesService();
        const controller = new authActivitiesController_1.AuthActivitiesController(service);
        router.use(middlewares_1.AuthMiddleware.validateJWT);
        router.get(exports.routes.list, controller.list);
        router.get(exports.routes.byId, controller.byId);
        router.get(exports.routes.byUserId, controller.byUserId);
        return router;
    }
}
exports.AuthActivitiesRoutes = AuthActivitiesRoutes;
