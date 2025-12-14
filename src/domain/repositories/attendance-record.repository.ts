import { AttendanceRecordEntity } from "../entities/attendance-record.entity";
import { BaseRepository } from "./base.repository";

export abstract class AttendanceRecordRepository extends BaseRepository<AttendanceRecordEntity> {
  abstract findByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceRecordEntity[]>;
}
