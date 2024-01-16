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
exports.TasksService = void 0;
const BaseError_1 = require("../../../domain/errors/BaseError");
const SuccessResponseFormatter_1 = require("../../services/SuccessResponseFormatter");
const tasksRoutes_1 = require("./tasksRoutes");
const TaskModel_1 = __importDefault(require("../../../data/models/TaskModel"));
const TaskActivityModel_1 = __importDefault(require("../../../data/models/TaskActivityModel"));
const commonPath = "/api/tasks";
const resourceName = "Tasks";
class TasksService {
    // DI
    constructor() { }
    getTasks(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all } = paginationDto;
            return this.fetchLists({}, paginationDto, all);
        });
    }
    getTaksByCollaborator(paginationDto, collaboratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const { all } = paginationDto;
            const query = { assignees: collaboratorId };
            return this.fetchLists(query, paginationDto, all);
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield TaskModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatGetOneResponse({
                data: resource,
                resource: resourceName,
            });
            return response;
        });
    }
    createTask(taskDto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const activityIds = yield this.createOrUpdateActivities(taskDto);
            const task = new TaskModel_1.default(Object.assign(Object.assign({}, taskDto.data), { activities: activityIds, createdBy: uid, updatedBy: uid }));
            const savedTask = yield task.save();
            const populatedTask = yield TaskModel_1.default.populate(savedTask, {
                path: "activities",
            });
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.fortmatCreateResponse({
                data: populatedTask,
                resource: resourceName,
            });
            return response;
        });
    }
    updateTask(id, dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const activityIds = yield this.createOrUpdateActivities(dto);
            const resourceToUpdate = yield TaskModel_1.default.findById(id);
            if (!resourceToUpdate)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found with id ${id}`);
            const updatedResource = yield TaskModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto.data), { activities: activityIds, updatedAt: new Date(), updatedBy: uid }), { new: true });
            const populatedResource = yield TaskModel_1.default.populate(updatedResource, {
                path: "activities",
            });
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatUpdateResponse({
                data: populatedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    deleteTask(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield TaskModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found with id ${id}`);
            const deletedResource = yield TaskModel_1.default.findByIdAndDelete(id);
            const response = SuccessResponseFormatter_1.SuccessResponseFormatter.formatDeleteResponse({
                data: deletedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    createOrUpdateActivities(taskDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const activityIds = [];
            if (taskDto.data.activities) {
                for (const activity of taskDto.data.activities) {
                    let existingActivity = null;
                    // Check if the activity already exists based on some criteria, for example, using _id
                    if (activity._id) {
                        existingActivity = yield TaskActivityModel_1.default.findById(activity._id);
                    }
                    if (existingActivity) {
                        // If activity exists, update it
                        existingActivity.set(activity);
                        yield existingActivity.save();
                        activityIds.push(existingActivity._id);
                    }
                    else {
                        // If activity doesn't exist, save it
                        const newActivity = new TaskActivityModel_1.default(activity);
                        yield newActivity.save();
                        activityIds.push(newActivity._id);
                    }
                }
            }
            return activityIds.length > 0 ? activityIds : undefined;
        });
    }
    fetchLists(query, paginationDto, all) {
        return __awaiter(this, void 0, void 0, function* () {
            const { page, limit } = paginationDto;
            try {
                let data;
                if (all) {
                    // If 'all' is present, fetch all resources without pagination
                    data = yield TaskModel_1.default.find(query).populate("activities");
                }
                else {
                    // Fetch paginated time-off requests
                    const [total, paginatedData] = yield Promise.all([
                        TaskModel_1.default.countDocuments(query),
                        TaskModel_1.default.find(query)
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
                    path: `${commonPath}${tasksRoutes_1.TasksPaths.all}`,
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
exports.TasksService = TasksService;
