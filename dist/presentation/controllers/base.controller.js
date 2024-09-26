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
exports.BaseController = void 0;
const application_1 = require("../../application");
const helpers_1 = require("../../shared/helpers");
class BaseController {
    constructor(service, dtoClass) {
        this.service = service;
        this.dtoClass = dtoClass;
        this.create = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const body = req.body;
                body.createdBy = (_a = req.authUser) === null || _a === void 0 ? void 0 : _a.uid;
                const dto = this.dtoClass.create(body);
                const result = yield this.service.create(dto);
                const response = application_1.ResponseFormatterService.formatCreateResponse({
                    data: result,
                    resource: this.resource,
                });
                return res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getAll = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
            try {
                const query = req.query;
                const options = (0, helpers_1.buildQueryOptions)(query);
                const result = yield this.service.getAll(options);
                const count = yield this.service.count(options);
                const response = application_1.ResponseFormatterService.formatListResponse({
                    data: result,
                    page: (_a = options.paginationDto.page) !== null && _a !== void 0 ? _a : 1,
                    limit: (_b = options.paginationDto.limit) !== null && _b !== void 0 ? _b : count,
                    total: count,
                    path: this.path,
                    resource: this.resource,
                });
                return res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.service.getById(id);
                const response = application_1.ResponseFormatterService.formatGetOneResponse({
                    data: result,
                    resource: this.resource,
                });
                return res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.update = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { id } = req.params;
                const body = req.body;
                body.updatedBy = (_a = req.authUser) === null || _a === void 0 ? void 0 : _a.uid;
                const dto = this.dtoClass.update(body);
                const result = yield this.service.update(id, dto);
                const response = application_1.ResponseFormatterService.formatUpdateResponse({
                    data: result,
                    resource: this.resource,
                });
                return res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.delete = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const result = yield this.service.delete(id);
                const response = application_1.ResponseFormatterService.formatDeleteResponse({
                    data: result,
                    resource: this.resource,
                });
                return res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.createMany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const result = yield this.service.createMany(body);
                const response = application_1.ResponseFormatterService.formatCreateManyResponse({
                    data: result,
                    resource: this.resource,
                });
                return res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateMany = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const result = yield this.service.updateMany(body);
                const response = application_1.ResponseFormatterService.formatUpdateManyResponse({
                    data: result,
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
exports.BaseController = BaseController;
