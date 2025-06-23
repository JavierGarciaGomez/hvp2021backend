import {
  CommissionAllocationDTO,
  CommissionAllocationService,
  ResponseFormatterService,
} from "../../application";
import { BaseController } from "./base.controller";
import { CommissionAllocationEntity } from "../../domain";
import { AuthenticatedRequest, buildQueryOptions } from "../../shared";
import { NextFunction, Response } from "express";

export class CommissionAllocationController extends BaseController<
  CommissionAllocationEntity,
  CommissionAllocationDTO
> {
  protected resource = "CommissionAllocations";
  protected path = "/CommissionAllocations";
  constructor(protected service: CommissionAllocationService) {
    super(service, CommissionAllocationDTO);
  }

  public getCommissionsStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getCommissionsStats(options);
      const response = ResponseFormatterService.formatGetOneResponse({
        data,
        resource: this.resource,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public getCommissionPromotionStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getCommissionPromotionStats(options);
      const response = ResponseFormatterService.formatGetOneResponse({
        data,
        resource: this.resource,
      });
      res.json(response);
    } catch (error) {
      next(error);
    }
  };

  public getCollaboratorCommissionStats = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { collaboratorId } = req.params;
      const query = req.query;
      const options = buildQueryOptions(query);
      const data = await this.service.getCollaboratorCommissionStats(
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

  public getCollaboratorHourlyCommissionAverage = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { collaboratorId } = req.params;
      const { newStartingDate } = req.query;

      if (!newStartingDate || typeof newStartingDate !== "string") {
        return res.status(400).json({
          message: "newStartingDate query parameter is required",
        });
      }

      const data = await this.service.getCollaboratorHourlyCommissionAverage(
        collaboratorId,
        newStartingDate
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
