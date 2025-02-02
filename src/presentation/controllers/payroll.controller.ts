import {
  PayrollDTO,
  PayrollService,
  ResponseFormatterService,
} from "../../application";
import { BaseController } from "./base.controller";
import { PayrollEntity } from "../../domain";
import { AuthenticatedRequest, buildQueryOptions } from "../../shared";
import { NextFunction, Response } from "express";

export class PayrollController extends BaseController<
  PayrollEntity,
  PayrollDTO
> {
  protected resource = "payrolls";
  protected path = "/payrolls";
  constructor(protected service: PayrollService) {
    super(service, PayrollDTO);
  }

  public getPayrollEstimates = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getPayrollEstimates(options);
      const response = ResponseFormatterService.formatListResponse({
        data,
        path: this.path,
        resource: "payroll-estimate",
        page: options.paginationDto?.page ?? 1,
        limit: options.paginationDto?.limit ?? data.length,
        total: data.length,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public getPayrollEstimateByCollaboratorId = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { collaboratorId } = req.params;
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getPayrollEstimateByCollaboratorId(
        collaboratorId,
        options
      );
      const response = ResponseFormatterService.formatGetOneResponse({
        data,
        resource: "payroll-estimate",
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
