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
const domain_1 = require("../../../domain");
const BaseError_1 = require("../../../shared/errors/BaseError");
const SuccessResponseFormatter_1 = require("../../services/SuccessResponseFormatter");
const TaskModel_1 = __importDefault(require("../../../infrastructure/db/mongo/models/TaskModel"));
const TaskActivityModel_1 = __importDefault(require("../../../infrastructure/db/mongo/models/TaskActivityModel"));
const authorizationHelpers_1 = require("../../../shared/helpers/authorizationHelpers");
const helpers_1 = require("../../../shared/helpers");
const commonPath = "/api/tasks";
const resourceName = "Tasks";
class TasksService {
    // DI
    constructor(notificationService) {
        this.notificationService = notificationService;
    }
    getTasks(paginationDto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { role } = authenticatedCollaborator;
            const hasAccessRole = (0, authorizationHelpers_1.isManagerOrAdmin)(role);
            const query = {};
            if (!hasAccessRole) {
                query["isRestrictedView"] = false;
            }
            return (0, helpers_1.fetchList)({
                model: TaskModel_1.default,
                query,
                paginationDto,
                path: `${commonPath}`,
                resourceName: "Tasks",
                populateOptions: [{ path: "activities" }],
            });
        });
    }
    getTaksByCollaborator(paginationDto, collaboratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { assignees: collaboratorId };
            return (0, helpers_1.fetchList)({
                model: TaskModel_1.default,
                query,
                paginationDto,
                path: `${commonPath}/collaborator/${collaboratorId}`,
                resourceName: "Tasks",
            });
        });
    }
    getTaskById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield TaskModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                data: resource,
                resource: resourceName,
            });
            return response;
        });
    }
    createTask(taskDto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const activityIds = yield this.createOrUpdateActivities(taskDto, uid);
            const task = new TaskModel_1.default(Object.assign(Object.assign({}, taskDto.data), { activities: activityIds, createdBy: uid, updatedBy: uid }));
            const savedTask = yield task.save();
            // Notify assignees
            const assignees = taskDto.data.assignees;
            this.notificationService.notifyCollaborators({
                title: "Task assigned",
                message: task.title,
                referenceId: savedTask._id.toString(),
                referenceType: domain_1.NotificationReferenceType.TASK,
                actionType: domain_1.NotificationActionType.ASSIGNED,
                collaboratorIds: assignees,
            });
            const populatedTask = yield TaskModel_1.default.populate(savedTask, {
                path: "activities",
            });
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.fortmatCreateResponse({
                data: populatedTask,
                resource: resourceName,
            });
            return response;
        });
    }
    updateTask(id, dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const activityIds = yield this.createOrUpdateActivities(dto, uid);
            const resourceToUpdate = yield TaskModel_1.default.findById(id);
            if (!resourceToUpdate)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found with id ${id}`);
            const oldAssignees = Array.isArray(resourceToUpdate.assignees)
                ? resourceToUpdate.assignees.map((assignee) => assignee.toString())
                : [];
            const newAssignees = dto.data.assignees;
            const addedAssignees = newAssignees.filter((assignee) => !oldAssignees.includes(assignee));
            const removedAssignees = oldAssignees.filter((assignee) => !newAssignees.includes(assignee));
            const updatedResource = yield TaskModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto.data), { activities: activityIds, updatedAt: new Date(), updatedBy: uid }), { new: true });
            const populatedResource = yield TaskModel_1.default.populate(updatedResource, {
                path: "activities",
            });
            // Notify added assignees
            if (addedAssignees.length > 0) {
                this.notificationService.notifyCollaborators({
                    title: "Task assigned",
                    message: `${populatedResource.number}-${populatedResource.title}`,
                    referenceId: populatedResource._id.toString(),
                    referenceType: domain_1.NotificationReferenceType.TASK,
                    actionType: domain_1.NotificationActionType.ASSIGNED,
                    collaboratorIds: addedAssignees,
                });
            }
            // Notify removed assignees
            if (removedAssignees.length > 0) {
                this.notificationService.notifyCollaborators({
                    title: "Task unassigned",
                    message: `${populatedResource.number}-${populatedResource.title}`,
                    referenceId: populatedResource._id.toString(),
                    referenceType: domain_1.NotificationReferenceType.TASK,
                    actionType: domain_1.NotificationActionType.UNASSIGNED,
                    collaboratorIds: removedAssignees,
                });
            }
            // Notify all assignees if task status changes
            if (resourceToUpdate.status !== dto.data.status) {
                this.notificationService.notifyCollaborators({
                    title: "Task status changed",
                    message: `${populatedResource.number}-${populatedResource.title} - New status: ${dto.data.status}`,
                    referenceId: populatedResource._id.toString(),
                    referenceType: domain_1.NotificationReferenceType.TASK,
                    actionType: domain_1.NotificationActionType.STATUS_CHANGED,
                    collaboratorIds: newAssignees,
                });
            }
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatUpdateResponse({
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
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatDeleteResponse({
                data: deletedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    createOrUpdateActivities(taskDto, uid) {
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
                        existingActivity.set(Object.assign(Object.assign({}, activity), { createdBy: uid, updatedBy: uid }));
                        yield existingActivity.save();
                        activityIds.push(existingActivity._id);
                    }
                    else {
                        // If activity doesn't exist, save it
                        const newActivity = new TaskActivityModel_1.default(Object.assign(Object.assign({}, activity), { createdBy: activity.createdBy !== ""
                                ? activity.createdBy
                                : uid, updatedBy: uid, updatedAt: new Date() }));
                        yield newActivity.save();
                        activityIds.push(newActivity._id);
                    }
                }
            }
            return activityIds.length > 0 ? activityIds : undefined;
        });
    }
}
exports.TasksService = TasksService;
