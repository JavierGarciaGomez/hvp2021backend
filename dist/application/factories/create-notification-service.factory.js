"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNotificationService = void 0;
const infrastructure_1 = require("../../infrastructure");
const services_1 = require("../services");
const createNotificationService = () => {
    const datasource = new infrastructure_1.NotificationDataSourceMongoImp();
    const repository = new infrastructure_1.NotificationRepositoryImpl(datasource);
    const service = new services_1.NotificationService(repository);
    return service;
};
exports.createNotificationService = createNotificationService;
