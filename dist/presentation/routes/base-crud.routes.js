"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCRUDRoutes = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
const domain_1 = require("../../domain");
class BaseCRUDRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    getRoutes() {
        return this.router;
    }
    setupCrudRoutes(controller) {
        this.router.delete("/bulk", middlewares_1.AuthMiddleware.validateJWT, (0, middlewares_1.authorizationMiddleware)({
            roles: [domain_1.WebAppRole.admin],
        }), controller.deleteMany);
        this.router.post("/bulk", middlewares_1.AuthMiddleware.validateJWT, (0, middlewares_1.authorizationMiddleware)({
            roles: [domain_1.WebAppRole.admin],
        }), controller.createMany);
        this.router.get("/", middlewares_1.AuthMiddleware.validateJWT, controller.getAll);
        this.router.get("/:id", middlewares_1.AuthMiddleware.validateJWT, controller.getById);
        this.router.post("/", middlewares_1.AuthMiddleware.validateJWT, controller.create);
        this.router.patch("/:id", middlewares_1.AuthMiddleware.validateJWT, controller.update);
        this.router.delete("/:id", middlewares_1.AuthMiddleware.validateJWT, controller.delete);
        this.router.patch("/", middlewares_1.AuthMiddleware.validateJWT, (0, middlewares_1.authorizationMiddleware)({
            roles: [domain_1.WebAppRole.admin],
        }), controller.updateMany);
    }
}
exports.BaseCRUDRoutes = BaseCRUDRoutes;
