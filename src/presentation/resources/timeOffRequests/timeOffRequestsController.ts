import { Response, Request, NextFunction } from "express";
// import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";

import { RequestWithAuthCollaborator } from "../../../types/RequestsAndResponses";
import { PaginationDto } from "../../../domain";
import { TimeOffRequestsService } from "./timeOffRequestsService";
import { TimeOffRequestDto } from "../../../domain/dtos/timeOffRequests/TimeOffRequestDto";
import { BaseError } from "../../../domain/errors/BaseError";
import { TimeOffRequest } from "../../../data/types/timeOffTypes";

export class TimeOffRequestController {
  constructor(
    private readonly timeOffRequestsService: TimeOffRequestsService
  ) {}

  // TODO This need to throw error to next so its catched by handleErrorMiddleware
  private handleError = (error: unknown, res: Response, next: NextFunction) => {
    next(error);
  };
  // Todo review
  public getTimeOffRequests = async (
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

      const timeOffRequestsResponse =
        await this.timeOffRequestsService.getTimeOffRequests(paginationDto!);
      res
        .status(timeOffRequestsResponse.status_code)
        .json(timeOffRequestsResponse);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getTimeOffRequestsByCollaborator = async (
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
        await this.timeOffRequestsService.getTimeOffRequestsByCollaborator(
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

  public getTimeOffRequestsByYear = async (
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

      const year = req.params.year;

      const timeOffRequestsResponse =
        await this.timeOffRequestsService.getTimeOffRequestsByYear(
          paginationDto!,
          Number(year)
        );
      res
        .status(timeOffRequestsResponse.status_code)
        .json(timeOffRequestsResponse);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getTimeOffRequestById = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const response = await this.timeOffRequestsService.getTimeOffRequestById(
        id
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public createTimeOffRequest = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, createTimeOffRequestDto] = TimeOffRequestDto.create(body);
      if (error)
        throw BaseError.badRequest("Invalid time off request data", error);

      const response = await this.timeOffRequestsService.createTimeOffRequest(
        createTimeOffRequestDto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateTimeOffRequest = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, timeOffRequestDto] = TimeOffRequestDto.update(body);
      if (error)
        throw BaseError.badRequest("Invalid time off request data", error);

      const response = await this.timeOffRequestsService.updateTimeOffRequest(
        id,
        timeOffRequestDto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public approveTimeOffRequest = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { approvedBy, managerNote, status } =
        req.body as Partial<TimeOffRequest>;

      const response = await this.timeOffRequestsService.approveTimeOffRequest(
        { approvedBy, managerNote, status },
        id
      );
      res.status(response.status_code).json(response);
    } catch (error) {}
  };
  public deleteTimeOffRequest = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {};
  public getCollaboratorTimeOffOverview = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const endDateParam = req.query.endDate?.toString();
      const endDate = endDateParam ? new Date(endDateParam) : new Date();

      const collaboratorId = req.params.collaboratorId;

      const response =
        await this.timeOffRequestsService.getCollaboratorTimeOffOverview(
          collaboratorId,
          new Date(endDate)
        );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
  public getCollaboratorsTimeOffOverview = async (
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

      const response =
        await this.timeOffRequestsService.getCollaboratorsTimeOffOverview(
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
