import { Response, Request, NextFunction } from "express";
import { RequestWithAuthCollaborator } from "../../../types/RequestsAndResponses";
import { PaginationDto } from "../../../domain";
import { AttendanceRecordsService } from "./attendanceRecordService";

import { BaseError } from "../../../domain/errors/BaseError";
import { WorkLogDto } from "../../../domain/dtos/workLogs/WorkLogDto";
import { AttendanceRecordDto } from "../../../domain/dtos/attendanceRecords/AttendanceRecordDto";

export class AttendanceRecordsController {
  constructor(
    private readonly timeAttendanceService: AttendanceRecordsService
  ) {}

  private handleError = (error: unknown, res: Response, next: NextFunction) => {
    next(error);
  };

  public getAttendanceRecords = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));

      const response = await this.timeAttendanceService.getAttendanceRecords(
        paginationDto!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getAttendanceRecordsByCollaborator = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));

      const collaboratorId = req.params.collaboratorId;

      const response =
        await this.timeAttendanceService.getAttendanceRecordsByCollaborator(
          paginationDto!,
          collaboratorId
        );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getCurrentAttendanceRecords = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { page, limit } = req.query;
      const paginationDto = PaginationDto.create(Number(page), Number(limit));

      const response =
        await this.timeAttendanceService.getCurrentAttendanceRecords(
          paginationDto!
        );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getLastAttendanceRecordByCollaborator = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const collaboratorId = req.params.collaboratorId;
      const response =
        await this.timeAttendanceService.getLastAttendanceRecordByCollaborator(
          collaboratorId
        );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public getAttendanceRecordById = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    const id = req.params.id;
    try {
      const response = await this.timeAttendanceService.getAttendanceRecordById(
        id
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      this.handleError(error, res, next);
    }
  };

  public createAttendanceRecord = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, dto] = AttendanceRecordDto.create(body);
      if (error) throw BaseError.badRequest("Invalid data", error);

      const response = await this.timeAttendanceService.createAttendanceRecord(
        dto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public updateAttendanceRecord = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const { authenticatedCollaborator } = req;
      const body = req.body;
      const [error, dto] = AttendanceRecordDto.update(body);
      if (error) throw BaseError.badRequest("Invalid request data", error);

      const response = await this.timeAttendanceService.updateAttendanceRecord(
        id,
        dto!,
        authenticatedCollaborator!
      );
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };

  public deleteAttendanceRecord = async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const id = req.params.id;
      const response = await this.timeAttendanceService.deleteWorkLog(id);
      res.status(response.status_code).json(response);
    } catch (error) {
      next(error);
    }
  };
}
