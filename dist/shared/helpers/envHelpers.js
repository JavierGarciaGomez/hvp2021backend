"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnvsByEnvironment = void 0;
const envs_plugin_1 = require("../../infrastructure/adapters/envs.plugin");
const getEnvsByEnvironment = () => {
    const environment = envs_plugin_1.envsPlugin.NODE_ENV;
    switch (environment) {
        case "production":
            return Object.assign(Object.assign({}, envs_plugin_1.prodEnvs), envs_plugin_1.commonEnvs);
        case "development": {
            return Object.assign(Object.assign({}, envs_plugin_1.devEnvs), envs_plugin_1.commonEnvs);
        }
        case "test": {
            return Object.assign(Object.assign({}, envs_plugin_1.testEnvs), envs_plugin_1.commonEnvs);
        }
        default:
            return Object.assign(Object.assign({}, envs_plugin_1.devEnvs), envs_plugin_1.commonEnvs);
    }
};
exports.getEnvsByEnvironment = getEnvsByEnvironment;
