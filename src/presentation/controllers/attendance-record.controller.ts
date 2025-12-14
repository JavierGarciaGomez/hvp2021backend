import {
  AttendanceRecordDTO,
  AttendanceRecordService,
  ResponseFormatterService,
} from "../../application";
import { BaseController } from "./base.controller";
import { AttendanceRecordEntity } from "../../domain";
import { AuthenticatedRequest } from "../../shared";
import { NextFunction, Response } from "express";

export class AttendanceRecordController extends BaseController<
  AttendanceRecordEntity,
  AttendanceRecordDTO
> {
  protected resource = "attendance-records";
  protected path = "/attendance-records";
  constructor(protected service: AttendanceRecordService) {
    super(service, AttendanceRecordDTO);
  }

  getLastAttendanceRecordByCollaborator = async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const collaboratorId = req.params.collaboratorId;
      const result = await this.service.getLastAttendanceRecordByCollaborator(
        collaboratorId
      );
      const response = ResponseFormatterService.formatGetOneResponse({
        data: result,
        resource: this.resource,
      });
      return res.status(response.status_code).json(response);
    } catch (error) {}
  };
}
