import { AttendanceReportService } from "../services";

export const createAttendanceReportService = () => {
  const service = new AttendanceReportService();
  return service;
};
