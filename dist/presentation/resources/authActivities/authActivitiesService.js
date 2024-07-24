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
exports.AuthActivitiesService = void 0;
const miscHelpers_1 = require("./../../../shared/helpers/miscHelpers");
const mainRoutes_1 = require("../../../mainRoutes");
const authActivitiesRoutes_1 = require("./authActivitiesRoutes");
const helpers_1 = require("../../../shared/helpers");
const infrastructure_1 = require("../../../infrastructure");
class AuthActivitiesService {
    constructor() { }
    list(paginationDto, sortingDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchList)({
                model: infrastructure_1.AuthActivityModel,
                query: {},
                paginationDto,
                sortingDto,
                path: "auth-activities",
                resourceName: "AuthActivity",
            });
        });
    }
    static logActivity(userId, activity) {
        return __awaiter(this, void 0, void 0, function* () {
            yield infrastructure_1.AuthActivityModel.create({
                user: userId,
                activity,
                createdBy: userId,
                updatedBy: userId,
            });
        });
    }
    byId(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchById)({
                model: infrastructure_1.AuthActivityModel,
                id,
                resourceName: "AuthActivity",
            });
        });
    }
    listByUserId(userId, paginationDto, sortingDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchList)({
                model: infrastructure_1.AuthActivityModel,
                query: { user: userId },
                paginationDto,
                sortingDto,
                path: (0, miscHelpers_1.buildRelativePath)(mainRoutes_1.mainRoutes.authActivities, authActivitiesRoutes_1.routes.byUserId, userId),
                resourceName: "AuthActivity",
            });
        });
    }
}
exports.AuthActivitiesService = AuthActivitiesService;
