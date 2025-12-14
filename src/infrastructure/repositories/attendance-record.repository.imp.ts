import { AttendanceRecordEntity } from "../../domain/entities/attendance-record.entity";
import { AttendanceRecordRepository } from "../../domain/repositories/attendance-record.repository";
import { AttendanceRecordDatasource } from "../../domain/datasources/attendance-record.datasource";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class AttendanceRecordRepositoryImp
  extends BaseRepositoryImpl<AttendanceRecordEntity>
  implements AttendanceRecordRepository
{
  constructor(readonly datasource: AttendanceRecordDatasource) {
    super(datasource);
  }
  findByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceRecordEntity[]> {
    return this.datasource.findByCollaboratorAndDateRange(
      collaboratorId,
      startDate,
      endDate
    );
  }
}
