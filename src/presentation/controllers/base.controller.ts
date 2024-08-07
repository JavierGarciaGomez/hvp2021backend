import { BaseDTO, BaseDTOConstructor } from "./../../application/dtos/base.dto";
import { Request, Response, NextFunction } from "express";
import { ResponseFormatterService } from "../../application";
import { BaseService } from "../../application/services/base.service";
import { AuthenticatedRequest } from "../../shared";
import { buildQueryOptions } from "../../shared/helpers";
import { BaseEntity } from "../../domain";

export abstract class BaseController<
  T extends BaseEntity,
  DTO extends BaseDTO
> {
  protected abstract resource: string;
  protected abstract path: string;

  constructor(
    protected readonly service: BaseService<T, DTO>,
    protected readonly dtoClass: BaseDTOConstructor<DTO>
  ) {}

  public create = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const body = req.body;
      body.createdBy = req.authUser?.uid;

      const dto = this.dtoClass.create(body) as DTO;

      const result = await this.service.create(dto);
      const response = ResponseFormatterService.formatCreateResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getAll = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const query = req.query;
      const options = buildQueryOptions(query);
      const result = await this.service.getAll(options);
      const count = await this.service.count();
      const response = ResponseFormatterService.formatListResponse({
        data: result,
        page: options.paginationDto.page ?? 1,
        limit: options.paginationDto.limit ?? count,
        total: count,
        path: this.path,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public getById = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const result = await this.service.getById(id);
      const response = ResponseFormatterService.formatGetOneResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public update = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const body = req.body;
      body.updatedBy = req.authUser?.uid;
      const dto = this.dtoClass.update(body) as DTO;
      const result = await this.service.update(id, dto);
      const response = ResponseFormatterService.formatUpdateResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public delete = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ): Promise<Response | void> => {
    try {
      const { id } = req.params;
      const result = await this.service.delete(id);
      const response = ResponseFormatterService.formatDeleteResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
