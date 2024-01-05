import { Response, Request, NextFunction } from "express";
// import { CreateCategoryDto, CustomError, PaginationDto } from "../../domain";

import { RequestWithAuthCollaborator } from "../../../types/RequestsAndResponses";

import throwErrorResponse from "../../../helpers/throwErrorResponse";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { TimeOffRequestsService } from "./timeOffRequestsService";
import TimeOffRequestModel from "../../../data/models/TimeOffRequestModel";

export class TimeOffRequestController {
  constructor(
    private readonly timeOffRequestsService: TimeOffRequestsService
  ) {}

  // TODO This need to throw error to next so its catched by handleErrorMiddleware
  private handleError = (error: unknown, res: Response, next: NextFunction) => {
    next(error);
    if (error instanceof BaseError) {
      return res.status(error.statusCode).json({ error: error.message });
    }
  };
  // Todo review
  public getTimeOffRequests = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page = 1, limit = 10, all } = req.query;
      const isAll = all === "true" || all === "";
      const [error, paginationDto] = PaginationDto.create(+page, +limit, isAll);
      if (error) this.handleError(error, res, next);

      const timeOffRequestsResponse =
        await this.timeOffRequestsService.getTimeOffRequests(paginationDto!);
      res
        .status(timeOffRequestsResponse.status_code)
        .json(timeOffRequestsResponse);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  private handleRequest = async ({
    req,
    res,
    query,
    operation,
  }: HandleRequestParams) => {
    try {
      const timeOffRequests = await TimeOffRequestModel.find(query);
      res.status(200).json({
        msg: operation,
        statusCode: 200,
        data: timeOffRequests,
        operation,
      });
    } catch (error) {
      throwErrorResponse({
        res,
        statusCode: 500,
        operation,
        error: error as Error,
      });
    }
  };
}

interface HandleRequestParams {
  req: RequestWithAuthCollaborator;
  res: Response;
  query: any;
  operation: string;
}
