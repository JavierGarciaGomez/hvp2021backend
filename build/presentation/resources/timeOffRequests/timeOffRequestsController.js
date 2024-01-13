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
exports.TimeOffRequestController = void 0;
const domain_1 = require("../../../domain");
const TimeOffRequestDto_1 = require("../../../domain/dtos/timeOffRequests/TimeOffRequestDto");
const BaseError_1 = require("../../../domain/errors/BaseError");
class TimeOffRequestController {
    constructor(timeOffRequestsService) {
        this.timeOffRequestsService = timeOffRequestsService;
        // TODO This need to throw error to next so its catched by handleErrorMiddleware
        this.handleError = (error, res, next) => {
            next(error);
        };
        // Todo review
        this.getTimeOffRequests = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, all } = req.query;
                const isAll = all === "true" || all === "" || (page === 1 && limit === 10);
                const [error, paginationDto] = domain_1.PaginationDto.create(+page, +limit, isAll);
                if (error)
                    this.handleError(error, res, next);
                const timeOffRequestsResponse = yield this.timeOffRequestsService.getTimeOffRequests(paginationDto);
                res
                    .status(timeOffRequestsResponse.status_code)
                    .json(timeOffRequestsResponse);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getTimeOffRequestsByCollaborator = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, all } = req.query;
                const isAll = all === "true" || all === "" || (page === 1 && limit === 10);
                const [error, paginationDto] = domain_1.PaginationDto.create(+page, +limit, isAll);
                if (error)
                    this.handleError(error, res, next);
                const collaboratorId = req.params.collaboratorId;
                const timeOffRequestsResponse = yield this.timeOffRequestsService.getTimeOffRequestsByCollaborator(paginationDto, collaboratorId);
                res
                    .status(timeOffRequestsResponse.status_code)
                    .json(timeOffRequestsResponse);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getTimeOffRequestsByYear = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, all } = req.query;
                const isAll = all === "true" || all === "" || (page === 1 && limit === 10);
                const [error, paginationDto] = domain_1.PaginationDto.create(+page, +limit, isAll);
                if (error)
                    this.handleError(error, res, next);
                const year = req.params.year;
                const timeOffRequestsResponse = yield this.timeOffRequestsService.getTimeOffRequestsByYear(paginationDto, Number(year));
                res
                    .status(timeOffRequestsResponse.status_code)
                    .json(timeOffRequestsResponse);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getTimeOffRequestById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const response = yield this.timeOffRequestsService.getTimeOffRequestById(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.createTimeOffRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authenticatedCollaborator } = req;
                const body = req.body;
                const [error, createTimeOffRequestDto] = TimeOffRequestDto_1.TimeOffRequestDto.create(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid time off request data", error);
                const response = yield this.timeOffRequestsService.createTimeOffRequest(createTimeOffRequestDto, authenticatedCollaborator);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateTimeOffRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { authenticatedCollaborator } = req;
                const body = req.body;
                const [error, timeOffRequestDto] = TimeOffRequestDto_1.TimeOffRequestDto.update(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid time off request data", error);
                const response = yield this.timeOffRequestsService.updateTimeOffRequest(id, timeOffRequestDto, authenticatedCollaborator);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.approveTimeOffRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { approvedBy, managerNote, status } = req.body;
                const response = yield this.timeOffRequestsService.approveTimeOffRequest({ approvedBy, managerNote, status }, id);
                res.status(response.status_code).json(response);
            }
            catch (error) { }
        });
        this.deleteTimeOffRequest = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.timeOffRequestsService.deleteTimeOffRequest(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getCollaboratorTimeOffOverview = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const endDateParam = (_a = req.query.endDate) === null || _a === void 0 ? void 0 : _a.toString();
                const endDate = endDateParam ? new Date(endDateParam) : new Date();
                const collaboratorId = req.params.collaboratorId;
                const response = yield this.timeOffRequestsService.getCollaboratorTimeOffOverview(collaboratorId, new Date(endDate));
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.getCollaboratorsTimeOffOverview = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page = 1, limit = 10, all } = req.query;
                const isAll = all === "true" || all === "" || (page === 1 && limit === 10);
                const [error, paginationDto] = domain_1.PaginationDto.create(+page, +limit, isAll);
                if (error)
                    this.handleError(error, res, next);
                const response = yield this.timeOffRequestsService.getCollaboratorsTimeOffOverview(paginationDto);
                res.status(response.status_code).json(response);
            }
            catch (error) { }
        });
    }
}
exports.TimeOffRequestController = TimeOffRequestController;
