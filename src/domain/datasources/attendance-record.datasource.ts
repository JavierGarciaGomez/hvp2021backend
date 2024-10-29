import { AttendanceRecordEntity } from "../entities/attendance-record.entity";
import { BaseDatasource } from "./base.datasource";

export abstract class AttendanceRecordDatasource extends BaseDatasource<AttendanceRecordEntity> {
  abstract findByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceRecordEntity[]>;
}
