import { Response, Request, NextFunction } from "express";
import { AuthenticatedRequest } from "../../../shared/interfaces/RequestsAndResponses";
import { PaginationDto } from "../../../domain";
import { TasksService } from "./tasksService";
import { TaskDto } from "../../../domain/dtos/tasks/TaskDto";
import { BaseError } from "../../../shared/errors/BaseError";

export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  private handleError = (error: unknown, res: Response, next: NextFunction) => {
    next(error);
  };

  public getTasks = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authUser } = req;
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));

      const response = await this.taskService.getTasks(
        paginationDto!,
        authUser!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getTasksByCollaborator = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));

      const collaboratorId = req.params.collaboratorId;

      const timeOffRequestsResponse =
        await this.taskService.getTaksByCollaborator(
          paginationDto!,
          collaboratorId
        );
      res
        .status(timeOffRequestsResponse.status_code)
        .json(timeOffRequestsResponse);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getTasksById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const response = await this.taskService.getTaskById(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public createTask = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authUser } = req;
      const body = req.body;
      const [error, createTimeOffRequestDto] = TaskDto.create(body);
      if (error) throw BaseError.badRequest("Invalid Task data", error);

      const response = await this.taskService.createTask(
        createTimeOffRequestDto!,
        authUser!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { authUser } = req;
      const body = req.body;
      const [error, dto] = TaskDto.update(body);
      if (error) throw BaseError.badRequest("Invalid request data", error);

      const response = await this.taskService.updateTask(id, dto!, authUser!);
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteTask = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await this.taskService.deleteTask(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
