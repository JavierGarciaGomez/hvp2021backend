"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseCRUDRoutes = void 0;
const express_1 = require("express");
const middlewares_1 = require("../middlewares");
class BaseCRUDRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.initializeRoutes();
    }
    getRoutes() {
        return this.router;
    }
    setupCrudRoutes(controller) {
        this.router.get("/", middlewares_1.AuthMiddleware.validateJWT, controller.getAll);
        this.router.get("/:id", middlewares_1.AuthMiddleware.validateJWT, controller.getById);
        this.router.post("/", middlewares_1.AuthMiddleware.validateJWT, controller.create);
        this.router.patch("/:id", middlewares_1.AuthMiddleware.validateJWT, controller.update);
        this.router.delete("/:id", middlewares_1.AuthMiddleware.validateJWT, controller.delete);
        this.router.patch("/", middlewares_1.AuthMiddleware.validateJWT, controller.updateMany);
        this.router.post("/bulk", middlewares_1.AuthMiddleware.validateJWT, controller.createMany);
    }
}
exports.BaseCRUDRoutes = BaseCRUDRoutes;
