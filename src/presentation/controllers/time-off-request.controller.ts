import {
  ResponseFormatterService,
  TimeOffRequestDTO,
  TimeOffRequestService,
} from "../../application";
import { BaseController } from "./base.controller";
import { TimeOffRequestEntity } from "../../domain";
import { AuthenticatedRequest } from "../../shared";
import { NextFunction, Response } from "express";

export class TimeOffRequestController extends BaseController<
  TimeOffRequestEntity,
  TimeOffRequestDTO
> {
  protected resource = "time-off-request";
  protected path = "/time-off-request";
  constructor(protected service: TimeOffRequestService) {
    super(service, TimeOffRequestDTO);
  }

  public getCollaboratorTimeOffOverview = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const endDateParam = req.query.endDate?.toString();
      const endDate = endDateParam ? new Date(endDateParam) : new Date();
      const result = await this.service.getCollaboratorTimeOffOverview(
        id,
        endDate
      );
      const response = ResponseFormatterService.formatGetOneResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getCollaboratorsTimeOffOverview = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const result = await this.service.getCollaboratorsTimeOffOverview();
      const response = ResponseFormatterService.formatListResponse({
        data: result,
        resource: this.resource,
        page: 1,
        limit: result.length,
        total: result.length,
        path: this.path,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
