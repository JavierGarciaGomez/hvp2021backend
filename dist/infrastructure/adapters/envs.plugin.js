"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.testEnvs = exports.prodEnvs = exports.devEnvs = exports.commonEnvs = exports.envsPlugin = void 0;
require("dotenv/config");
const env = __importStar(require("env-var"));
exports.envsPlugin = {
    NODE_ENV: env.get("NODE_ENV").required().asString(),
    // Environment: Development
    DEV_MONGO_URL: env.get("DEV_MONGO_URL").required().asString(),
    DEV_MONGO_DB_NAME: env.get("DEV_MONGO_DB_NAME").required().asString(),
    DEV_MONGO_USER: env.get("DEV_MONGO_USER").required().asString(),
    DEV_MONGO_PASS: env.get("DEV_MONGO_PASS").required().asString(),
    DEV_CLIENT_URL: env.get("DEV_CLIENT_URL").required().asString(),
    DEV_CLIENT_URL2: env.get("DEV_CLIENT_URL2").required().asString(),
    // Environment: Production
    PROD_MONGO_URL: env.get("PROD_MONGO_URL").required().asString(),
    PROD_MONGO_DB_NAME: env.get("PROD_MONGO_DB_NAME").required().asString(),
    PROD_MONGO_USER: env.get("PROD_MONGO_USER").required().asString(),
    PROD_MONGO_PASS: env.get("PROD_MONGO_PASS").required().asString(),
    PROD_CLIENT_URL: env.get("PROD_CLIENT_URL").required().asString(),
    PROD_CLIENT_URL2: env.get("PROD_CLIENT_URL2").required().asString(),
    // Environment: Test
    // TEST_MONGO_URL: env.get("TEST_MONGO_URL").asString(),
    // TEST_MONGO_DB_NAME: env.get("TEST_MONGO_DB_NAME").asString(),
    // TEST_MONGO_USER: env.get("TEST_MONGO_USER").asString(),
    // TEST_MONGO_PASS: env.get("TEST_MONGO_PASS").asString(),
    // TEST_CLIENT_URL: env.get("TEST_CLIENT_URL").asString(),
    // TEST_CLIENT_URL2: env.get("TEST_CLIENT_URL2").asString(),
    // Environment: Common
    PORT: env.get("PORT").required().asPortNumber(),
    BASE_URL: env.get("BASE_URL").required().asString(),
    MAILER_EMAIL: env.get("MAILER_EMAIL").required().asEmailString(),
    MAILER_SECRET_KEY: env.get("MAILER_SECRET_KEY").required().asString(),
    MAILER_SERVICE: env.get("MAILER_SERVICE").required().asString(),
    PUBLIC_PATH: env.get("PUBLIC_PATH").required().asString(),
    GOOGLE_CLIENT_ID: env.get("GOOGLE_CLIENT_ID").required().asString(),
    GOOGLE_CLIENT_SECRET: env.get("GOOGLE_CLIENT_SECRET").required().asString(),
    SECRET_JWT_SEED: env.get("SECRET_JWT_SEED").required().asString(),
};
exports.commonEnvs = {
    BASE_URL: exports.envsPlugin.BASE_URL,
    PORT: exports.envsPlugin.PORT,
    MAILER_EMAIL: exports.envsPlugin.MAILER_EMAIL,
    MAILER_SECRET_KEY: exports.envsPlugin.MAILER_SECRET_KEY,
    MAILER_SERVICE: exports.envsPlugin.MAILER_SERVICE,
    PUBLIC_PATH: exports.envsPlugin.PUBLIC_PATH,
    GOOGLE_CLIENT_ID: exports.envsPlugin.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: exports.envsPlugin.GOOGLE_CLIENT_SECRET,
    SECRET_JWT_SEED: exports.envsPlugin.SECRET_JWT_SEED,
};
exports.devEnvs = {
    NODE_ENV: exports.envsPlugin.NODE_ENV,
    MONGO_URL: exports.envsPlugin.DEV_MONGO_URL,
    MONGO_DB_NAME: exports.envsPlugin.DEV_MONGO_DB_NAME,
    MONGO_USER: exports.envsPlugin.DEV_MONGO_USER,
    MONGO_PASS: exports.envsPlugin.DEV_MONGO_PASS,
    CLIENT_URL: exports.envsPlugin.DEV_CLIENT_URL,
    CLIENT_URL2: exports.envsPlugin.DEV_CLIENT_URL2,
};
exports.prodEnvs = {
    NODE_ENV: exports.envsPlugin.NODE_ENV,
    MONGO_URL: exports.envsPlugin.PROD_MONGO_URL,
    MONGO_DB_NAME: exports.envsPlugin.PROD_MONGO_DB_NAME,
    MONGO_USER: exports.envsPlugin.PROD_MONGO_USER,
    MONGO_PASS: exports.envsPlugin.PROD_MONGO_PASS,
    CLIENT_URL: exports.envsPlugin.PROD_CLIENT_URL,
    CLIENT_URL2: exports.envsPlugin.PROD_CLIENT_URL2,
};
exports.testEnvs = {
    NODE_ENV: exports.envsPlugin.NODE_ENV,
    MONGO_URL: exports.envsPlugin.DEV_MONGO_URL,
    MONGO_DB_NAME: exports.envsPlugin.DEV_MONGO_DB_NAME,
    MONGO_USER: exports.envsPlugin.DEV_MONGO_USER,
    MONGO_PASS: exports.envsPlugin.DEV_MONGO_PASS,
    CLIENT_URL: exports.envsPlugin.DEV_CLIENT_URL,
    CLIENT_URL2: exports.envsPlugin.DEV_CLIENT_URL2,
};
