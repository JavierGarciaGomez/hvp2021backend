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
exports.WorkLogsService = void 0;
const BaseError_1 = require("../../../domain/errors/BaseError");
const SuccessResponseFormatter_1 = require("../../services/SuccessResponseFormatter");
const workLogsRoutes_1 = require("./workLogsRoutes");
const TaskActivityModel_1 = __importDefault(require("../../../data/models/TaskActivityModel"));
const WorkLogModel_1 = __importDefault(require("../../../data/models/WorkLogModel"));
const TaskModel_1 = __importDefault(require("../../../data/models/TaskModel"));
const taskHelpers_1 = require("../../../helpers/taskHelpers");
const commonPath = "/api/work-logs";
const resourceName = "WorkLogs";
class WorkLogsService {
    // DI
    constructor() { }
    getWorkLogs(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all } = paginationDto;
            return this.fetchLists({}, paginationDto, all);
        });
    }
    getWorkLogsByCollaborator(paginationDto, collaboratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all } = paginationDto;
            const query = { createdBy: collaboratorId };
            return this.fetchLists(query, paginationDto, all);
        });
    }
    getWorkLogById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield WorkLogModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatGetOneResponse({
                data: resource,
                resource: resourceName,
            });
            return response;
        });
    }
    createWorkLog(dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const activities = yield this.createOrUpdateActivities(dto, uid);
            const resource = new WorkLogModel_1.default(Object.assign(Object.assign({}, dto.data), { activities: activities, createdBy: uid, updatedBy: uid }));
            const savedResource = yield resource.save();
            const populatedResource = yield WorkLogModel_1.default.populate(savedResource, {
                path: "activities",
            });
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.fortmatCreateResponse({
                data: populatedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    updateWorkLog(id, dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const activities = yield this.createOrUpdateActivities(dto, uid);
            const resourceToUpdate = yield WorkLogModel_1.default.findById(id);
            if (!resourceToUpdate)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found with id ${id}`);
            const updatedResource = yield WorkLogModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto.data), { activities: activities, updatedAt: new Date(), updatedBy: uid }), { new: true });
            const populatedResource = yield WorkLogModel_1.default.populate(updatedResource, {
                path: "activities",
            });
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatUpdateResponse({
                data: populatedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    deleteWorkLog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield WorkLogModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found with id ${id}`);
            const deletedResource = yield WorkLogModel_1.default.findByIdAndDelete(id);
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatDeleteResponse({
                data: deletedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    createOrUpdateActivities(dto, uid) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const activities = [];
            if (dto.data.activities) {
                for (const activity of dto.data.activities) {
                    const workLogActivity = Object.assign(Object.assign({}, activity), { createdBy: uid, updatedBy: uid, createdAt: new Date(), updatedAt: new Date() });
                    let relatedTaskActivityId = undefined;
                    if (activity.relatedTask) {
                        // Fetch the TaskModel with the id of the relatedTask
                        const task = yield TaskModel_1.default.findById(activity.relatedTask);
                        if (task) {
                            if (activity.relatedTaskActivity) {
                                // If the task activity is provided, update it
                                const updatedTaskActivity = yield TaskActivityModel_1.default.findByIdAndUpdate(activity.relatedTaskActivity, Object.assign(Object.assign({}, workLogActivity), { author: uid, registeredAt: dto.data.logDate }), { new: true });
                                relatedTaskActivityId = (_a = updatedTaskActivity === null || updatedTaskActivity === void 0 ? void 0 : updatedTaskActivity._id) === null || _a === void 0 ? void 0 : _a.toString();
                            }
                            else {
                                // If no task activity is provided, create a new one
                                const newActivity = new TaskActivityModel_1.default(Object.assign(Object.assign({}, workLogActivity), { author: uid, registeredAt: dto.data.logDate }));
                                const updatedTaskActivity = yield newActivity.save();
                                relatedTaskActivityId = (_b = updatedTaskActivity === null || updatedTaskActivity === void 0 ? void 0 : updatedTaskActivity._id) === null || _b === void 0 ? void 0 : _b.toString();
                                if (!task.activities) {
                                    task.activities = [];
                                }
                                // Push the updated task activity
                                if (updatedTaskActivity) {
                                    task.activities.push(updatedTaskActivity);
                                }
                            }
                            const taskStatus = (0, taskHelpers_1.getTaskStatus)(task.status);
                            yield TaskModel_1.default.findOneAndUpdate({ _id: activity.relatedTask }, { activities: task.activities, status: taskStatus }, { new: true });
                        }
                    }
                    // Push the original workLogActivity to the activities array
                    (workLogActivity.relatedTaskActivity =
                        relatedTaskActivityId),
                        activities.push(workLogActivity);
                }
            }
            return activities;
        });
    }
    fetchLists(query, paginationDto, all) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginationDto;
            try {
                let data;
                if (all) {
                    // If 'all' is present, fetch all resources without pagination
                    data = yield WorkLogModel_1.default.find(query).populate("activities");
                }
                else {
                    // Fetch paginated time-off requests
                    const [total, paginatedData] = yield Promise.all([
                        WorkLogModel_1.default.countDocuments(query),
                        WorkLogModel_1.default.find(query)
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
                    path: `${commonPath}${workLogsRoutes_1.WorkLogsPaths.all}`,
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
exports.WorkLogsService = WorkLogsService;
