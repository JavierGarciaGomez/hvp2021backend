import {
  AttendanceRecordRepositoryImp,
  AttendanceRecordDatasourceMongoImp,
} from "../../infrastructure/";

import { AttendanceRecordService } from "../services";

export const createAttendanceRecordService = (): AttendanceRecordService => {
  const datasource = new AttendanceRecordDatasourceMongoImp();
  const repository = new AttendanceRecordRepositoryImp(datasource);
  return new AttendanceRecordService(repository);
};
