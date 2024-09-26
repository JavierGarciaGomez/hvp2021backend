import { NextFunction, Request, Response } from "express";
import {
  CollaboratorDTO,
  CollaboratorService,
  ResponseFormatterService,
} from "../../application";
import { buildQueryOptions } from "../../shared/helpers/queryHelpers";

import { AuthenticatedRequest } from "../../shared/interfaces/RequestsAndResponses";
import { JwtAdapter } from "../../infrastructure/adapters";
import { BaseController } from "./base.controller";
import { CollaboratorEntity, CollaboratorResponse } from "../../domain";

export class CollaboratorController extends BaseController<
  CollaboratorEntity,
  CollaboratorDTO,
  CollaboratorResponse
> {
  protected resource = "collaborator";
  protected path = "/collaborators";
  constructor(protected readonly service: CollaboratorService) {
    super(service, CollaboratorDTO);
  }

  public getAllPublic = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const options = { isActive: true, isDisplayedWeb: true };
      const newOptions = buildQueryOptions(options);
      const result = await this.service.getAllPublic(newOptions);
      const response = ResponseFormatterService.formatListResponse({
        data: result,
        page: newOptions.paginationDto.page ?? 1,
        limit: newOptions.paginationDto.limit ?? result.length,
        total: result.length,
        path: this.path,
        resource: this.resource,
      });
      return res.status(response.status_code).json(result);
    } catch (error) {
      next(error);
    }
  };

  public register = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const body = req.body;
      const dto = CollaboratorDTO.register(body);

      const result = await this.service.register(dto);

      const token = await JwtAdapter.generateToken({ ...result });
      const response = ResponseFormatterService.formatUpdateResponse({
        data: { token, user: result.toCollaboratorAuth() },
        resource: this.resource,
      });

      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
