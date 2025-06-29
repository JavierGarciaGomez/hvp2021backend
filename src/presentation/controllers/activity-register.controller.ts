import {
  ActivityRegisterDTO,
  ActivityRegisterService,
  ResponseFormatterService,
} from "../../application";
import { BaseController } from "./base.controller";
import { ActivityRegisterEntity } from "../../domain";
import { AuthenticatedRequest, buildQueryOptions } from "../../shared";
import { NextFunction, Response } from "express";

export class ActivityRegisterController extends BaseController<
  ActivityRegisterEntity,
  ActivityRegisterDTO
> {
  protected resource = "activity-register";
  protected path = "/activity-register";
  constructor(protected service: ActivityRegisterService) {
    super(service, ActivityRegisterDTO);
  }

  public calculateDuration = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      const options = buildQueryOptions(query);
      const duration = await this.service.calculateDuration(options);
      const response = ResponseFormatterService.formatGetOneResponse({
        resource: this.resource,
        data: duration,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public calculateCollaboratorDuration = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { collaboratorId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate || !endDate) {
        return res.status(400).json({
          message: "startDate and endDate query parameters are required",
        });
      }

      const duration = await this.service.calculateCollaboratorDuration(
        collaboratorId,
        new Date(startDate as string),
        new Date(endDate as string)
      );

      const response = ResponseFormatterService.formatGetOneResponse({
        resource: this.resource,
        data: { duration },
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
