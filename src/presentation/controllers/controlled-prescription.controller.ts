import {
  ControlledPrescriptionDTO,
  ControlledPrescriptionService,
  ResponseFormatterService,
} from "../../application";
import { BaseController } from "./base.controller";
import { ControlledPrescriptionEntity } from "../../domain";
import { mainRoutes } from "../../mainRoutes";
import { AuthenticatedRequest } from "../../shared";
import { NextFunction, Response } from "express";

export class ControlledPrescriptionController extends BaseController<
  ControlledPrescriptionEntity,
  ControlledPrescriptionDTO
> {
  protected resource = "controlled-prescription";
  protected path = "/controlled-prescriptions";
  constructor(protected service: ControlledPrescriptionService) {
    super(service, ControlledPrescriptionDTO);
  }

  public getStatusOptions = (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const resOptions = this.service.getStatusOptions();
      const response = ResponseFormatterService.formatListResponse({
        data: resOptions,
        page: 1,
        limit: resOptions.length,
        total: resOptions.length,
        path: `${this.path}/status-options`,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
