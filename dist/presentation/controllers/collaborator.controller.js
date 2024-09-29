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
exports.CollaboratorController = void 0;
const application_1 = require("../../application");
const queryHelpers_1 = require("../../shared/helpers/queryHelpers");
const adapters_1 = require("../../infrastructure/adapters");
const base_controller_1 = require("./base.controller");
class CollaboratorController extends base_controller_1.BaseController {
    constructor(service) {
        super(service, application_1.CollaboratorDTO);
        this.service = service;
        this.resource = "collaborator";
        this.path = "/collaborators";
        this.getAllPublic = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c, _d;
            try {
                const options = { isActive: true, isDisplayedWeb: true };
                const newOptions = (0, queryHelpers_1.buildQueryOptions)(options);
                const result = yield this.service.getAllPublic(newOptions);
                const response = application_1.ResponseFormatterService.formatListResponse({
                    data: result,
                    page: (_b = (_a = newOptions.paginationDto) === null || _a === void 0 ? void 0 : _a.page) !== null && _b !== void 0 ? _b : 1,
                    limit: (_d = (_c = newOptions.paginationDto) === null || _c === void 0 ? void 0 : _c.limit) !== null && _d !== void 0 ? _d : result.length,
                    total: result.length,
                    path: this.path,
                    resource: this.resource,
                });
                return res.status(response.status_code).json(result);
            }
            catch (error) {
                next(error);
            }
        });
        this.register = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const dto = application_1.CollaboratorDTO.register(body);
                const result = yield this.service.register(dto);
                const token = yield adapters_1.JwtAdapter.generateToken(Object.assign({}, result));
                const response = application_1.ResponseFormatterService.formatUpdateResponse({
                    data: { token, user: result.toCollaboratorAuth() },
                    resource: this.resource,
                });
                return res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.CollaboratorController = CollaboratorController;
