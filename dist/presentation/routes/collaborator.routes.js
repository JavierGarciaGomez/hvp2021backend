"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorRoutes = void 0;
const controllers_1 = require("./../controllers");
const infrastructure_1 = require("../../infrastructure");
const application_1 = require("../../application");
const middlewares_1 = require("../middlewares");
const base_crud_routes_1 = require("./base-crud.routes");
class CollaboratorRoutes extends base_crud_routes_1.BaseCRUDRoutes {
    initializeRoutes() {
        const datasource = new infrastructure_1.CollaboratorDataSourceMongoImp();
        const repository = new infrastructure_1.CollaboratorRepositoryImpl(datasource);
        const service = new application_1.CollaboratorService(repository);
        const controller = new controllers_1.CollaboratorController(service);
        this.router.get("/getAllForWeb", controller.getAllPublic);
        this.setupCrudRoutes(controller);
        this.router.patch("/register", controller.register);
        // todo this should be removed
        this.router.post("/create", middlewares_1.AuthMiddleware.validateJWT, controller.create);
    }
}
exports.CollaboratorRoutes = CollaboratorRoutes;
