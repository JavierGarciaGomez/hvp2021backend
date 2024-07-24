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
exports.AuthActivitiesController = void 0;
const domain_1 = require("../../../domain");
const sorting_dto_1 = require("../../../application/dtos/shared/sorting.dto");
const helpers_1 = require("../../../shared/helpers");
class AuthActivitiesController {
    constructor(service) {
        this.service = service;
        this.list = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 20, sort_by = "createdAt", direction = "desc", } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const sortingDto = sorting_dto_1.SortingDto.create(sort_by, direction);
                const response = yield this.service.list(paginationDto, sortingDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                (0, helpers_1.handleError)(error, res, next);
            }
        });
        this.byUserId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id: userId } = req.params;
                const { page = 1, limit = 20, sort_by = "createdAt", direction = "DESC", } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const sortingDto = sorting_dto_1.SortingDto.create(sort_by, direction);
                const response = yield this.service.listByUserId(userId, paginationDto, sortingDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                (0, helpers_1.handleError)(error, res, next);
            }
        });
        this.byId = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const response = yield this.service.byId(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                (0, helpers_1.handleError)(error, res, next);
            }
        });
    }
}
exports.AuthActivitiesController = AuthActivitiesController;
