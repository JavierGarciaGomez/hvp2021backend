"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationRepositoryImpl = void 0;
const base_repository_imp_1 = require("./base.repository.imp");
class NotificationRepositoryImpl extends base_repository_imp_1.BaseRepositoryImpl {
    constructor(datasource) {
        super(datasource);
        this.datasource = datasource;
    }
}
exports.NotificationRepositoryImpl = NotificationRepositoryImpl;
