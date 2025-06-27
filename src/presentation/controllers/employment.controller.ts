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
}
