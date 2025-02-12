import {
  CollaboratorEntity,
  CollaboratorResponse,
  EmploymentEntity,
  JobEntity,
  PayrollEntity,
  SalaryDataEntity,
} from "../entities";
import { CollaboratorAttendanceReport } from "./collaborator-attendance-report.rm";

// TODO
export interface PayrollEstimate {
  payroll: PayrollEntity;
}

export interface PayrollCollaboratorRawData {
  collaborator: CollaboratorResponse;
  employment: EmploymentEntity;
  job: JobEntity;
  attendanceReport: CollaboratorAttendanceReport;
  salaryData: SalaryDataEntity;
}
