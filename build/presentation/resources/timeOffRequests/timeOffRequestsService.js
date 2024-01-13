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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeOffRequestsService = void 0;
const TimeOffRequestModel_1 = __importDefault(require("../../../data/models/TimeOffRequestModel"));
const timeOffTypes_1 = require("../../../data/types/timeOffTypes");
const BaseError_1 = require("../../../domain/errors/BaseError");
const SuccessResponseFormatter_1 = require("../../services/SuccessResponseFormatter");
const timeOffRequestsRoutes_1 = require("./timeOffRequestsRoutes");
const Collaborator_1 = require("../../../models/Collaborator");
const timeOffHelpers_1 = require("../../../helpers/timeOffHelpers");
const dateHelpers_1 = require("../../../helpers/dateHelpers");
const collaboratorsHelpers_1 = require("../../../helpers/collaboratorsHelpers");
// import {
//   CreateCategoryDto,
//   CustomError,
//   PaginationDto,
//   UserEntity,
// } from "../../domain";
const commonPath = "/api/time-off-requests";
const resource = "TimeOffRequests";
class TimeOffRequestsService {
    // DI
    constructor() { }
    getTimeOffRequests(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all } = paginationDto;
            return this.fetchTimeOffRequestsLists({}, paginationDto, all);
        });
    }
    getTimeOffRequestsByCollaborator(paginationDto, collaboratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all } = paginationDto;
            const query = { collaborator: collaboratorId };
            return this.fetchTimeOffRequestsLists(query, paginationDto, all);
        });
    }
    getTimeOffRequestsByYear(paginationDto, year) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all } = paginationDto;
            const query = {
                requestedDays: {
                    $gte: new Date(`${year}-01-01`),
                    $lte: new Date(`${year}-12-31`),
                },
            };
            return this.fetchTimeOffRequestsLists(query, paginationDto, all);
        });
    }
    getTimeOffRequestById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeOffRequest = yield TimeOffRequestModel_1.default.findById(id);
            if (!timeOffRequest)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatGetOneResponse({
                data: timeOffRequest,
                resource,
            });
            return response;
        });
    }
    createTimeOffRequest(timeOffRequestDto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const timeOffRequest = new TimeOffRequestModel_1.default(Object.assign(Object.assign({}, timeOffRequestDto.data), { createdBy: uid }));
            const firstTimeOffDate = (0, dateHelpers_1.getEarliestDate)(timeOffRequest.requestedDays);
            const vacationsDaysRequested = timeOffRequest.requestedDays.length;
            const { remainingVacationDays, dateTimeOffRequests } = yield (0, timeOffHelpers_1.getCollaboratorTimeOffOverviewDetails)(uid, firstTimeOffDate);
            // TODO: Check if dates were already requested
            for (const date of timeOffRequest.requestedDays) {
                const dateOnly = (0, dateHelpers_1.formatDateWithoutTime)(date);
                const pendingDatesWithoutTime = dateTimeOffRequests
                    .map((dateTimeOffRequest) => dateTimeOffRequest.date)
                    .map(dateHelpers_1.formatDateWithoutTime);
                if (pendingDatesWithoutTime.includes(dateOnly)) {
                    throw BaseError_1.BaseError.badRequest(`The collaborator already has a time off request for the date ${dateOnly}.`);
                }
            }
            // Todo check if he has enough days
            if (timeOffRequest.timeOffType === timeOffTypes_1.TimeOffType.vacation &&
                remainingVacationDays < vacationsDaysRequested) {
                throw BaseError_1.BaseError.badRequest(`The collaborator has ${remainingVacationDays} vacations days for the ${firstTimeOffDate.toISOString()}.`);
            }
            const savedTimeOffRequest = yield timeOffRequest.save();
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.fortmatCreateResponse({
                data: savedTimeOffRequest,
                resource,
            });
            return response;
        });
    }
    updateTimeOffRequest(id, timeOffRequestDto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid, role } = authenticatedCollaborator;
            const timeOffRequest = yield TimeOffRequestModel_1.default.findById(id);
            if (!timeOffRequest)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            if (timeOffRequest.status !== timeOffTypes_1.TimeOffStatus.pending &&
                role !== Collaborator_1.CollaboratorRole.admin &&
                role !== Collaborator_1.CollaboratorRole.manager) {
                throw BaseError_1.BaseError.unauthorized("The time off request has already been approved.");
            }
            const firstVacationDate = (0, dateHelpers_1.getEarliestDate)(timeOffRequest.requestedDays);
            const vacationsDaysRequested = timeOffRequest.requestedDays.length;
            const { remainingVacationDays, vacationsTaken, vacationsRequested } = yield (0, timeOffHelpers_1.getCollaboratorTimeOffOverviewDetails)(uid, firstVacationDate, id);
            const pendingOrTakenVacations = vacationsTaken.concat(vacationsRequested);
            // TODO: Check if dates were already requested
            for (const date of timeOffRequestDto.data.requestedDays) {
                const dateOnly = (0, dateHelpers_1.formatDateWithoutTime)(new Date(date));
                const pendingDatesWithoutTime = pendingOrTakenVacations.map(dateHelpers_1.formatDateWithoutTime);
                if (pendingDatesWithoutTime.includes(dateOnly)) {
                    throw BaseError_1.BaseError.badRequest(`The collaborator already has a time off request for the date ${dateOnly}.`);
                }
            }
            // Todo check if he has enough days
            if (remainingVacationDays < vacationsDaysRequested) {
                throw BaseError_1.BaseError.badRequest(`The collaborator has ${remainingVacationDays} vacations days for the ${firstVacationDate.toISOString()}.`);
            }
            const updatedResource = yield TimeOffRequestModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, timeOffRequestDto.data), { updatedAt: new Date(), updatedBy: uid }), { new: true });
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatUpdateResponse({
                data: updatedResource,
                resource,
            });
            return response;
        });
    }
    approveTimeOffRequest({ approvedBy, managerNote, status }, id) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedResource = yield TimeOffRequestModel_1.default.findByIdAndUpdate(id, {
                approvedBy,
                managerNote,
                status,
                approvedAt: new Date(),
                updatedAt: new Date(),
            }, { new: true });
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatUpdateResponse({
                data: updatedResource,
                resource,
            });
            return response;
        });
    }
    deleteTimeOffRequest(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const timeOffRequest = yield TimeOffRequestModel_1.default.findById(id);
            if (!timeOffRequest)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            if (timeOffRequest.status !== timeOffTypes_1.TimeOffStatus.pending) {
                throw BaseError_1.BaseError.badRequest(`The time off request has already been approved/rejected.`);
            }
            const deletedResource = yield TimeOffRequestModel_1.default.findByIdAndDelete(id);
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatDeleteResponse({
                data: deletedResource,
                resource,
            });
            return response;
        });
    }
    getCollaboratorTimeOffOverview(collaboratorId, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const overview = yield (0, timeOffHelpers_1.getCollaboratorTimeOffOverviewDetails)(collaboratorId, endDate);
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatGetOneResponse({
                data: overview,
                resource: "CollaboratorTimeOffOverview",
            });
            return response;
        });
    }
    getCollaboratorsTimeOffOverview(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all, page, limit } = paginationDto;
            const activeCollaborators = yield (0, collaboratorsHelpers_1.getActiveCollaborators)();
            const collaboratorsOverview = [];
            for (const collaborator of activeCollaborators) {
                const collaboratorId = collaborator._id; // Adjust this based on your collaborator data structure
                // Use the getCollaboratorTimeOffOverview function to get the time-off overview for the current collaborator
                const overview = yield (0, timeOffHelpers_1.getCollaboratorTimeOffOverviewDetails)(collaboratorId);
                // Add the collaborator's time-off overview to the array
                collaboratorsOverview.push(overview);
            }
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatListResponse({
                data: collaboratorsOverview,
                page,
                limit,
                total: collaboratorsOverview.length,
                path: `${commonPath}${timeOffRequestsRoutes_1.TimeOffRequestsRoutePaths.collaboratorsOverview}`,
                resource: "CollaboratorsTimeOffOverview",
            });
            return response;
        });
    }
    fetchTimeOffRequestsLists(query, paginationDto, all) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginationDto;
            try {
                let data;
                if (all) {
                    // If 'all' is present, fetch all resources without pagination
                    data = yield TimeOffRequestModel_1.default.find(query);
                }
                else {
                    // Fetch paginated time-off requests
                    const [total, paginatedData] = yield Promise.all([
                        TimeOffRequestModel_1.default.countDocuments(query),
                        TimeOffRequestModel_1.default.find(query)
                            .skip((page - 1) * limit)
                            .limit(limit),
                    ]);
                    data = paginatedData;
                }
                const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatListResponse({
                    data,
                    page,
                    limit,
                    total: data.length,
                    path: `${commonPath}${timeOffRequestsRoutes_1.TimeOffRequestsRoutePaths.all}`,
                    resource: "TimeOffRequests",
                });
                return response;
            }
            catch (error) {
                throw BaseError_1.BaseError.internalServer("Internal Server Error");
            }
        });
    }
}
exports.TimeOffRequestsService = TimeOffRequestsService;
