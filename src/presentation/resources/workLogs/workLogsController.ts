import { Response, Request, NextFunction } from "express";
import { RequestWithAuthCollaborator } from "../../../types/RequestsAndResponses";
import { PaginationDto } from "../../../domain";
import { WorkLogsService } from "./workLogsService";

import { BaseError } from "../../../domain/errors/BaseError";
import { WorkLogDto } from "../../../domain/dtos/workLogs/WorkLogDto";

export class WorkLogsController {
  constructor(private readonly workLogService: WorkLogsService) {}

  private handleError = (error: unknown, res: Response, next: NextFunction) => {
    next(error);
  };

  public getWorkLogs = async (
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
      const response = await this.workLogService.getWorkLogs(paginationDto!);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getWorkLogsByCollaborator = async (
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
        await this.workLogService.getWorkLogsByCollaborator(
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

  public getWorkLogById = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const response = await this.workLogService.getWorkLogById(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public createWorkLog = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, dto] = WorkLogDto.create(body);
      if (error) throw BaseError.badRequest("Invalid WorkLog data", error);

      const response = await this.workLogService.createWorkLog(
        dto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateWorkLog = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, dto] = WorkLogDto.update(body);
      if (error) throw BaseError.badRequest("Invalid request data", error);

      const response = await this.workLogService.updateWorkLog(
        id,
        dto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteWorkLog = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await this.workLogService.deleteWorkLog(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
