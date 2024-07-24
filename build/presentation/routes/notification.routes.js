"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRoutes = void 0;
const infrastructure_1 = require("../../infrastructure");
const application_1 = require("../../application");
const notification_controller_1 = require("../controllers/notification.controller");
const base_crud_routes_1 = require("./base-crud.routes");
class NotificationRoutes extends base_crud_routes_1.BaseCRUDRoutes {
    initializeRoutes() {
        const datasource = new infrastructure_1.NotificationDataSourceMongoImp();
        const repository = new infrastructure_1.NotificationRepositoryImpl(datasource);
        const service = new application_1.NotificationService(repository);
        const controller = new notification_controller_1.NotificationController(service);
        this.setupCrudRoutes(controller);
    }
}
exports.NotificationRoutes = NotificationRoutes;
