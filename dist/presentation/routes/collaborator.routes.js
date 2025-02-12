"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorRoutes = void 0;
const controllers_1 = require("./../controllers");
const infrastructure_1 = require("../../infrastructure");
const application_1 = require("../../application");
const middlewares_1 = require("../middlewares");
const base_crud_routes_1 = require("./base-crud.routes");
const domain_1 = require("../../domain");
const authorization_middleware_1 = require("../middlewares/authorization.middleware");
class CollaboratorRoutes extends base_crud_routes_1.BaseCRUDRoutes {
    initializeRoutes() {
        const datasource = new infrastructure_1.CollaboratorDataSourceMongoImp();
        const repository = new infrastructure_1.CollaboratorRepositoryImpl(datasource);
        const service = new application_1.CollaboratorService(repository);
        const controller = new controllers_1.CollaboratorController(service);
        this.router.get("/getAllForWeb", controller.getAllPublic);
        this.router.get("/", middlewares_1.AuthMiddleware.validateJWT, controller.getAll);
        this.router.delete("/:id", middlewares_1.AuthMiddleware.validateJWT, (0, authorization_middleware_1.authorizationMiddleware)({
            roles: [domain_1.WebAppRole.admin],
        }), controller.delete);
        this.router.patch("/register", controller.register);
        this.router.patch("/:id", middlewares_1.AuthMiddleware.validateJWT, 
        // authorizationMiddleware({
        //   roles: [WebAppRole.admin, WebAppRole.manager],
        //   checkOwnership: true,
        //   resourceModel: CollaboratorModel,
        // }),
        controller.update);
        this.router.patch("/", middlewares_1.AuthMiddleware.validateJWT, (0, authorization_middleware_1.authorizationMiddleware)({
            roles: [domain_1.WebAppRole.admin],
        }), controller.updateMany);
        this.router.post("/create", middlewares_1.AuthMiddleware.validateJWT, (0, authorization_middleware_1.authorizationMiddleware)({
            roles: [domain_1.WebAppRole.admin, domain_1.WebAppRole.manager],
        }), controller.create);
        this.setupCrudRoutes(controller);
    }
}
exports.CollaboratorRoutes = CollaboratorRoutes;
