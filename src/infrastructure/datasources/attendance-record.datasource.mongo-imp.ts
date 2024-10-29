import {
  AttendanceRecordDatasource,
  AttendanceRecordEntity,
} from "../../domain";
import { AttendanceRecordModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class AttendanceRecordDatasourceMongoImp
  extends BaseDatasourceMongoImp<AttendanceRecordEntity>
  implements AttendanceRecordDatasource
{
  constructor() {
    super(AttendanceRecordModel, AttendanceRecordEntity);
  }

  async findByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date
  ): Promise<AttendanceRecordEntity[]> {
    const documents = await this.model.find({
      collaborator: collaboratorId,
      shiftDate: { $gte: startDate, $lte: endDate },
    });
    return documents;
  }
}
