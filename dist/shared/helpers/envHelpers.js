"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvsByEnvironment = void 0;
const adapters_1 = require("../../infrastructure/adapters");
const getEnvsByEnvironment = () => {
    const environment = adapters_1.envsPlugin.NODE_ENV;
    switch (environment) {
        case "production":
            return Object.assign(Object.assign({}, adapters_1.prodEnvs), adapters_1.commonEnvs);
        case "development": {
            return Object.assign(Object.assign({}, adapters_1.devEnvs), adapters_1.commonEnvs);
        }
        case "test": {
            return Object.assign(Object.assign({}, adapters_1.testEnvs), adapters_1.commonEnvs);
        }
        default:
            return Object.assign(Object.assign({}, adapters_1.devEnvs), adapters_1.commonEnvs);
    }
};
exports.getEnvsByEnvironment = getEnvsByEnvironment;
