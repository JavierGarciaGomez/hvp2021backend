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
exports.WorkLogsController = void 0;
const domain_1 = require("../../../domain");
const BaseError_1 = require("../../../domain/errors/BaseError");
const WorkLogDto_1 = require("../../../domain/dtos/workLogs/WorkLogDto");
class WorkLogsController {
    constructor(workLogService) {
        this.workLogService = workLogService;
        this.handleError = (error, res, next) => {
            next(error);
        };
        this.getWorkLogs = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, all } = req.query;
                const isAll = all === "true" || all === "" || (page === 1 && limit === 10);
                const [error, paginationDto] = domain_1.PaginationDto.create(+page, +limit, isAll);
                if (error)
                    this.handleError(error, res, next);
                const response = yield this.workLogService.getWorkLogs(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getWorkLogsByCollaborator = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, all } = req.query;
                const isAll = all === "true" || all === "" || (page === 1 && limit === 10);
                const [error, paginationDto] = domain_1.PaginationDto.create(+page, +limit, isAll);
                if (error)
                    this.handleError(error, res, next);
                const collaboratorId = req.params.collaboratorId;
                const timeOffRequestsResponse = yield this.workLogService.getWorkLogsByCollaborator(paginationDto, collaboratorId);
                res
                    .status(timeOffRequestsResponse.status_code)
                    .json(timeOffRequestsResponse);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getWorkLogById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const response = yield this.workLogService.getWorkLogById(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.createWorkLog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authenticatedCollaborator } = req;
                const body = req.body;
                const [error, dto] = WorkLogDto_1.WorkLogDto.create(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid WorkLog data", error);
                const response = yield this.workLogService.createWorkLog(dto, authenticatedCollaborator);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateWorkLog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { authenticatedCollaborator } = req;
                const body = req.body;
                const [error, dto] = WorkLogDto_1.WorkLogDto.update(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid request data", error);
                const response = yield this.workLogService.updateWorkLog(id, dto, authenticatedCollaborator);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteWorkLog = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.workLogService.deleteWorkLog(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.WorkLogsController = WorkLogsController;
