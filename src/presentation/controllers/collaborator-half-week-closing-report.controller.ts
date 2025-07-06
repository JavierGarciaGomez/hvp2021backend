import { NextFunction, Request, Response } from "express";
import {
  CollaboratorHalfWeekClosingReportDTO,
  CollaboratorHalfWeekClosingReportService,
  ResponseFormatterService,
} from "../../application";
import { buildQueryOptions } from "../../shared/helpers/queryHelpers";
import { BaseController } from "./base.controller";
import {
  CollaboratorHalfWeekClosingReportEntity,
  CollaboratorHalfWeekClosingReportResponse,
} from "../../domain";
import { AuthenticatedRequest } from "../../shared";

export class CollaboratorHalfWeekClosingReportController extends BaseController<
  CollaboratorHalfWeekClosingReportEntity,
  CollaboratorHalfWeekClosingReportDTO,
  CollaboratorHalfWeekClosingReportResponse
> {
  protected resource = "collaborator-half-week-closing-report";
  protected path = "/collaborator-half-week-closing-reports";

  constructor(
    protected readonly service: CollaboratorHalfWeekClosingReportService
  ) {
    super(service, CollaboratorHalfWeekClosingReportDTO);
  }

  // Override the base create method to use upsert logic
  public create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const body = req.body;
      body.createdBy = req.authUser?.uid;
      body.updatedBy = req.authUser?.uid;

      const dto = CollaboratorHalfWeekClosingReportDTO.create(body);

      const result = await this.service.upsert(dto, req?.authUser);
      const response = ResponseFormatterService.formatCreateResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public upsert = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const body = req.body;
      body.createdBy = req.authUser?.uid;
      body.updatedBy = req.authUser?.uid;

      const dto = CollaboratorHalfWeekClosingReportDTO.create(body);

      const result = await this.service.upsert(dto, req?.authUser);
      const response = ResponseFormatterService.formatCreateResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getByCollaboratorId = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { collaboratorId } = req.params;
      const query = req.query;
      const options = buildQueryOptions(query);

      const result = await this.service.getByCollaboratorId(
        collaboratorId,
        options
      );

      const response = ResponseFormatterService.formatListResponse({
        data: result,
        page: options.paginationDto?.page ?? 1,
        limit: options.paginationDto?.limit ?? result.length,
        total: result.length,
        path: this.path,
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getByDateRange = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { startDate, endDate } = req.query;
      const query = req.query;
      const options = buildQueryOptions(query);

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: "startDate and endDate are required query parameters",
        });
      }

      const result = await this.service.getByDateRange(
        new Date(startDate as string),
        new Date(endDate as string),
        options
      );

      const response = ResponseFormatterService.formatListResponse({
        data: result,
        page: options.paginationDto?.page ?? 1,
        limit: options.paginationDto?.limit ?? result.length,
        total: result.length,
        path: this.path,
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getByCollaboratorAndDateRange = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { collaboratorId } = req.params;
      const { startDate, endDate } = req.query;
      const query = req.query;
      const options = buildQueryOptions(query);

      if (!startDate || !endDate) {
        return res.status(400).json({
          error: "startDate and endDate are required query parameters",
        });
      }

      const result = await this.service.getByCollaboratorAndDateRange(
        collaboratorId,
        new Date(startDate as string),
        new Date(endDate as string),
        options
      );

      const response = ResponseFormatterService.formatListResponse({
        data: result,
        page: options.paginationDto?.page ?? 1,
        limit: options.paginationDto?.limit ?? result.length,
        total: result.length,
        path: this.path,
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
