"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDataSourceMongoImp = void 0;
const entities_1 = require("../../domain/entities");
const notification_model_1 = require("../db/mongo/models/notification.model");
const base_datasource_mongo_1 = require("./base.datasource.mongo");
class NotificationDataSourceMongoImp extends base_datasource_mongo_1.BaseDatasourceMongoImp {
    constructor() {
        super(notification_model_1.NotificationModel, entities_1.NotificationEntity);
    }
}
exports.NotificationDataSourceMongoImp = NotificationDataSourceMongoImp;
