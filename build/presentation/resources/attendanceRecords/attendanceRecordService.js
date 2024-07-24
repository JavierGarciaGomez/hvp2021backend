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
exports.AttendanceRecordsService = void 0;
const mainRoutes_1 = require("./../../../mainRoutes");
const BaseError_1 = require("../../../shared/errors/BaseError");
const SuccessResponseFormatter_1 = require("../../services/SuccessResponseFormatter");
const TaskActivityModel_1 = __importDefault(require("../../../infrastructure/db/mongo/models/TaskActivityModel"));
const TaskModel_1 = __importDefault(require("../../../infrastructure/db/mongo/models/TaskModel"));
const AttendanceRecordModel_1 = __importDefault(require("../../../infrastructure/db/mongo/models/AttendanceRecordModel"));
const dateHelpers_1 = require("../../../shared/helpers/dateHelpers");
const helpers_1 = require("../../../shared/helpers");
const commonPath = mainRoutes_1.mainRoutes.attendanceRecords;
const resourceName = "AttendanceRecords";
class AttendanceRecordsService {
    // DI
    constructor() { }
    getAttendanceRecords(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, helpers_1.fetchList)({
                model: AttendanceRecordModel_1.default,
                query: {},
                paginationDto,
                path: `${commonPath}`,
                resourceName: "AttendanceRecords",
            });
        });
    }
    getAttendanceRecordsByCollaborator(paginationDto, collaboratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { collaborator: collaboratorId };
            return (0, helpers_1.fetchList)({
                model: AttendanceRecordModel_1.default,
                query,
                paginationDto,
                path: `${commonPath}`,
                resourceName: "AttendanceRecords",
            });
        });
    }
    getCurrentAttendanceRecords(paginationDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const todayDate = (0, dateHelpers_1.getCurrentMexicanDate)();
            const query = {
                shiftDate: todayDate,
            };
            return (0, helpers_1.fetchList)({
                model: AttendanceRecordModel_1.default,
                query,
                paginationDto,
                path: `${commonPath}`,
                resourceName: "AttendanceRecords",
            });
        });
    }
    getLastAttendanceRecordByCollaborator(collaboratorId) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = { collaborator: collaboratorId };
            const resource = yield AttendanceRecordModel_1.default.findOne(query).sort("-shiftDate");
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found for collaborator ${collaboratorId}`);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                data: resource,
                resource: resourceName,
            });
            return response;
        });
    }
    getAttendanceRecordById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield AttendanceRecordModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resource} not found with id ${id}`);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatGetOneResponse({
                data: resource,
                resource: resourceName,
            });
            return response;
        });
    }
    createAttendanceRecord(dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            // todo review if the collaborator has already an attendance record for the same day
            const existingAttendanceRecord = yield AttendanceRecordModel_1.default.findOne({
                collaborator: uid,
                shiftDate: dto.data.shiftDate,
            });
            if (existingAttendanceRecord) {
                throw BaseError_1.BaseError.badRequest(`Attendance record already exists for collaborator ${uid} and date ${dto.data.shiftDate}`);
            }
            // const activities = await this.createOrUpdateActivities(dto, uid);
            const resource = new AttendanceRecordModel_1.default(Object.assign(Object.assign({}, dto.data), { createdBy: uid, updatedBy: uid }));
            const savedResource = yield resource.save();
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.fortmatCreateResponse({
                data: savedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    updateAttendanceRecord(id, dto, authenticatedCollaborator) {
        return __awaiter(this, void 0, void 0, function* () {
            const { uid } = authenticatedCollaborator;
            const resourceToUpdate = yield AttendanceRecordModel_1.default.findById(id);
            if (!resourceToUpdate)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found with id ${id}`);
            const updatedResource = yield AttendanceRecordModel_1.default.findByIdAndUpdate(id, Object.assign(Object.assign({}, dto.data), { updatedAt: new Date(), updatedBy: uid }), { new: true });
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatUpdateResponse({
                data: updatedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    deleteWorkLog(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resource = yield AttendanceRecordModel_1.default.findById(id);
            if (!resource)
                throw BaseError_1.BaseError.notFound(`${resourceName} not found with id ${id}`);
            const deletedResource = yield AttendanceRecordModel_1.default.findByIdAndDelete(id);
            const response = SuccessResponseFormatter_1.OldSuccessResponseFormatter.formatDeleteResponse({
                data: deletedResource,
                resource: resourceName,
            });
            return response;
        });
    }
    createOrUpdateActivities(dto, uid) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b;
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
                            // const taskStatus = getTaskStatus(task.status);
                            yield TaskModel_1.default.findOneAndUpdate({ _id: activity.relatedTask }, { activities: task.activities }, { new: true });
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
}
exports.AttendanceRecordsService = AttendanceRecordsService;
