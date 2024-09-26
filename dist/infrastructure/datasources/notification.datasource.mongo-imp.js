"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDataSourceMongoImp = void 0;
const entities_1 = require("../../domain/entities");
const db_1 = require("../db");
const base_datasource_mongo_imp_1 = require("./base.datasource.mongo-imp");
class NotificationDataSourceMongoImp extends base_datasource_mongo_imp_1.BaseDatasourceMongoImp {
    constructor() {
        super(db_1.NotificationModel, entities_1.NotificationEntity);
    }
}
exports.NotificationDataSourceMongoImp = NotificationDataSourceMongoImp;
