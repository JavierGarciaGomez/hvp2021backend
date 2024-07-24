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
exports.TasksController = void 0;
const domain_1 = require("../../../domain");
const TaskDto_1 = require("../../../domain/dtos/tasks/TaskDto");
const BaseError_1 = require("../../../shared/errors/BaseError");
class TasksController {
    constructor(taskService) {
        this.taskService = taskService;
        this.handleError = (error, res, next) => {
            next(error);
        };
        this.getTasks = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const response = yield this.taskService.getTasks(paginationDto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getTasksByCollaborator = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { page, limit } = req.query;
                const paginationDto = domain_1.PaginationDto.create(Number(page), Number(limit));
                const collaboratorId = req.params.collaboratorId;
                const timeOffRequestsResponse = yield this.taskService.getTaksByCollaborator(paginationDto, collaboratorId);
                res
                    .status(timeOffRequestsResponse.status_code)
                    .json(timeOffRequestsResponse);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.getTasksById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            try {
                const response = yield this.taskService.getTaskById(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                this.handleError(error, res, next);
            }
        });
        this.createTask = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { authUser } = req;
                const body = req.body;
                const [error, createTimeOffRequestDto] = TaskDto_1.TaskDto.create(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid Task data", error);
                const response = yield this.taskService.createTask(createTimeOffRequestDto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.updateTask = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const { authUser } = req;
                const body = req.body;
                const [error, dto] = TaskDto_1.TaskDto.update(body);
                if (error)
                    throw BaseError_1.BaseError.badRequest("Invalid request data", error);
                const response = yield this.taskService.updateTask(id, dto, authUser);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
        this.deleteTask = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const id = req.params.id;
                const response = yield this.taskService.deleteTask(id);
                res.status(response.status_code).json(response);
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.TasksController = TasksController;
