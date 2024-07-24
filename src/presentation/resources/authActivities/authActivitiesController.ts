import { NextFunction, Response } from "express";
import { RequestWithAuthCollaborator } from "../../../types/RequestsAndResponses";
import { AuthActivitiesService } from "./authActivitiesService";
import { PaginationDto } from "../../../domain";
import { handleError } from "../../../helpers";
import { SortingDto } from "../../../domain/dtos/shared/sorting.dto";

export class AuthActivitiesController {
  constructor(private readonly service: AuthActivitiesService) {}

  public list = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const {
        page = 1,
        limit = 20,
        sort_by = "createdAt",
        direction = "DESC",
      } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));
      const sortingDto = SortingDto.create(
        sort_by as string,
        direction as string
      );
      const response = await this.service.list(paginationDto, sortingDto);
      res.status(response.status_code).json(response);
    } catch (error) {
      handleError(error, res, next);
    }
  };

  public byUserId = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id: userId } = req.params;
      const {
        page = 1,
        limit = 20,
        sort_by = "createdAt",
        direction = "DESC",
      } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));
      const sortingDto = SortingDto.create(
        sort_by as string,
        direction as string
      );
      const response = await this.service.listByUserId(
        userId,
        paginationDto,
        sortingDto
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      handleError(error, res, next);
    }
  };

  public byId = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { id } = req.params;
      const response = await this.service.byId(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      handleError(error, res, next);
    }
  };
}
