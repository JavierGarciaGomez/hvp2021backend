"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const adapters_1 = require("./infrastructure/adapters");
const mongo_1 = require("./infrastructure/db/mongo");
const appRoutes_1 = require("./presentation/appRoutes");
const server_1 = require("./presentation/server");
const helpers_1 = require("./shared/helpers");
(() => __awaiter(void 0, void 0, void 0, function* () {
    main();
}))();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        const { MONGO_URL, MONGO_DB_NAME } = (0, helpers_1.getEnvsByEnvironment)();
        yield mongo_1.MongoDatabase.connect({
            mongoUrl: MONGO_URL,
            dbName: MONGO_DB_NAME,
        });
        const server = new server_1.Server({
            port: adapters_1.envsPlugin.PORT,
            public_path: adapters_1.envsPlugin.PUBLIC_PATH,
            routes: appRoutes_1.AppRoutes.routes,
        });
        server.start();
    });
}
