import {
  CommissionableServiceDTO,
  CommissionableServiceService,
  ResponseFormatterService,
} from "../../application";
import { BaseController } from "./base.controller";
import { CommissionableServiceEntity } from "../../domain";
import { AuthenticatedRequest, buildQueryOptions } from "../../shared";
import { NextFunction, Response } from "express";

export class CommissionableServiceController extends BaseController<
  CommissionableServiceEntity,
  CommissionableServiceDTO
> {
  protected resource = "CommissionableServices";
  protected path = "/CommissionableServices";
  constructor(protected service: CommissionableServiceService) {
    super(service, CommissionableServiceDTO);
  }

  public getCommissionCalculation = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getCommissionCalculation(options);
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
