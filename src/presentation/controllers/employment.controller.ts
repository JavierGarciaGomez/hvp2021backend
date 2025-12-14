import { EmploymentDTO, EmploymentService } from "../../application";
import { BaseController } from "./base.controller";
import { EmploymentEntity } from "../../domain";
import { Request, Response, NextFunction } from "express";
import { ResponseFormatterService } from "../../application";

export class EmploymentController extends BaseController<
  EmploymentEntity,
  EmploymentDTO
> {
  protected resource = "employments";
  protected path = "/employments";
  constructor(protected service: EmploymentService) {
    super(service, EmploymentDTO);
  }

  public createDraftEmployments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { startDate, endDate } = req.query;

      if (!startDate) {
        return res.status(400).json({
          success: false,
          message: "startDate parameter is required",
        });
      }

      const draftEmployments =
        await this.service.createDraftEmploymentsForActiveCollaborators(
          startDate as string,
          endDate as string | undefined
        );

      const response = ResponseFormatterService.formatListResponse({
        data: draftEmployments,
        page: 1,
        limit: draftEmployments.length,
        total: draftEmployments.length,
        path: this.path,
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public createDraftEmploymentForCollaborator = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { collaboratorId } = req.params;
      const { startDate, endDate } = req.query;

      if (!startDate) {
        return res.status(400).json({
          success: false,
          message: "startDate parameter is required",
        });
      }

      const result = await this.service.createDraftEmploymentForCollaborator(
        collaboratorId,
        startDate as string,
        endDate as string | undefined
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

  public createMany = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const employmentData = req.body;

      if (!Array.isArray(employmentData)) {
        return res.status(400).json({
          success: false,
          message: "Request body must be an array of employment objects",
        });
      }

      const authUser = (req as any).user;
      const result = await this.service.createManyFromDTOs(
        employmentData,
        authUser
      );

      const response = ResponseFormatterService.formatListResponse({
        data: result,
        page: 1,
        limit: result.length,
        total: result.length,
        path: this.path,
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public recalculateEmployment = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const employmentData = req.body;

      if (!employmentData) {
        return res.status(400).json({
          success: false,
          message: "Employment data is required",
        });
      }

      const result = await this.service.recalculateEmployment(employmentData);

      const response = ResponseFormatterService.formatGetOneResponse({
        data: result,
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public recalculateEmployments = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const employmentsData = req.body;

      if (!employmentsData || !Array.isArray(employmentsData)) {
        return res.status(400).json({
          success: false,
          message: "Request body must be an array of employment objects",
        });
      }

      // Transform raw data to DTOs
      const employmentDTOs = employmentsData.map((employmentData) =>
        EmploymentDTO.create(employmentData)
      );

      const results = await this.service.recalculateEmployments(employmentDTOs);

      const response = ResponseFormatterService.formatListResponse({
        data: results,
        page: 1,
        limit: results.length,
        total: results.length,
        path: this.path,
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
