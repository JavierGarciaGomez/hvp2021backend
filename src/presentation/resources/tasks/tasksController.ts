import { Response, Request, NextFunction } from "express";
// import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";

import { RequestWithAuthCollaborator } from "../../../types/RequestsAndResponses";
import { PaginationDto } from "../../../domain";
import { TasksService } from "./tasksService";
import { TaskDto } from "../../../domain/dtos/tasks/TaskDto";
import { BaseError } from "../../../domain/errors/BaseError";
import { TimeOffRequest } from "../../../data/types/timeOffTypes";

export class TasksController {
  constructor(private readonly taskService: TasksService) {}

  // TODO This need to throw error to next so its catched by handleErrorMiddleware
  private handleError = (error: unknown, res: Response, next: NextFunction) => {
    next(error);
  };
  // Todo review
  public getTasks = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    // try {
    //   const { page = 1, limit = 10, all } = req.query;
    //   const isAll =
    //     all === "true" || all === "" || (page === 1 && limit === 10);
    //   const [error, paginationDto] = PaginationDto.create(+page, +limit, isAll);
    //   if (error) this.handleError(error, res, next);
    //   const timeOffRequestsResponse = await this.taskService.getTimeOffRequests(
    //     paginationDto!
    //   );
    //   res
    //     .status(timeOffRequestsResponse.status_code)
    //     .json(timeOffRequestsResponse);
    // } catch (error) {
    //   this.handleError(error, res, next);
    // }
  };

  public getTasksByCollaborator = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 10, all } = req.query;
      const isAll =
        all === "true" || all === "" || (page === 1 && limit === 10);
      const [error, paginationDto] = PaginationDto.create(+page, +limit, isAll);
      if (error) this.handleError(error, res, next);

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
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const response = await this.taskService.getTaskById(id);
      // res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public createTask = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, createTimeOffRequestDto] = TaskDto.create(body);
      if (error) throw BaseError.badRequest("Invalid Task data", error);

      const response = await this.taskService.createTask(
        createTimeOffRequestDto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateTask = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, timeOffRequestDto] = TaskDto.update(body);
      if (error)
        throw BaseError.badRequest("Invalid time off request data", error);

      const response = await this.taskService.updateTask(
        id,
        timeOffRequestDto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteTask = async (
    req: RequestWithAuthCollaborator,
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
  public getCollaboratorTaskOverview = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const endDateParam = req.query.endDate?.toString();
      const endDate = endDateParam ? new Date(endDateParam) : new Date();

      const collaboratorId = req.params.collaboratorId;

      const response = await this.taskService.getCollaboratorTaskOverview(
        collaboratorId,
        new Date(endDate)
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
  public getCollaboratorsTasksOverview = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 10, all } = req.query;
      const isAll =
        all === "true" || all === "" || (page === 1 && limit === 10);
      const [error, paginationDto] = PaginationDto.create(+page, +limit, isAll);
      if (error) this.handleError(error, res, next);

      const response = await this.taskService.getCollaboratorsTaskOverview(
        paginationDto!
      );
      res.status(response.status_code).json(response);
    } catch (error) {}
  };
}

interface HandleRequestParams {
  req: RequestWithAuthCollaborator;
  res: Response;
  query: any;
  operation: string;
}
