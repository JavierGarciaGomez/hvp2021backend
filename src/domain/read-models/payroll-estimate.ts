import {
  CollaboratorEntity,
  CollaboratorResponse,
  EmploymentEntity,
  JobEntity,
  SalaryDataEntity,
} from "../entities";
import { CollaboratorAttendanceReport } from "./collaborator-attendance-report.rm";

// TODO
export interface PayrollEstimate {}

export interface PayrollCollaboratorRawData {
  collaborator: CollaboratorResponse;
  employment: EmploymentEntity;
  job: JobEntity;
  attendanceReport: CollaboratorAttendanceReport;
  salaryData: SalaryDataEntity;
}
