import {
  AttendanceReportService,
  ResponseFormatterService,
} from "../../application";
import { NextFunction, Response } from "express";
import { AuthenticatedRequest, buildQueryOptions } from "../../shared";

export class AttendanceReportController {
  protected resource = "attendance-report";
  protected path = "/attendance-report";
  constructor(protected service: AttendanceReportService) {
    this.service = service;
  }

  public getAll = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getAll(options);
      const response = ResponseFormatterService.formatListResponse({
        data,
        path: this.path,
        resource: this.resource,
        page: options.paginationDto?.page ?? 1,
        limit: options.paginationDto?.limit ?? data.length,
        total: data.length,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public getByCollaboratorId = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { collaboratorId } = req.params;
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getByCollaboratorId(
        collaboratorId,
        options
      );
      const response = ResponseFormatterService.formatGetOneResponse({
        data,
        resource: this.resource,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
