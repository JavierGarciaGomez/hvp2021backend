import {
  CollaboratorEntity,
  EmploymentEntity,
  JobEntity,
  SalaryDataEntity,
} from "../entities";
import { PayrollStatus } from "../enums";
import {
  PayrollGeneralData,
  PayrollEarnings,
  PayrollDeductions,
  PayrollTotals,
  PayrollContextData,
} from "../value-objects";
import { CollaboratorAttendanceReport } from "./collaborator-attendance-report.rm";

// TODO
export interface PayrollEstimate {
  id?: string;
  collaboratorId: string;
  payrollStatus?: PayrollStatus;
  periodStartDate: Date;
  periodEndDate: Date;
  generalData: PayrollGeneralData;
  earnings: PayrollEarnings;
  deductions: PayrollDeductions;
  totals: PayrollTotals;
  contextData: PayrollContextData;
}

export interface PayrollCollaboratorRawData {
  collaborator: CollaboratorEntity;
  employment: EmploymentEntity;
  job: JobEntity;
  attendanceReport: CollaboratorAttendanceReport;
  salaryData: SalaryDataEntity;
  totalCommissions: number;
}
