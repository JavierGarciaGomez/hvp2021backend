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
  relevantValues: PayrollEstimateRelevantValues;
}

export interface PayrollCollaboratorRawData {
  collaborator: CollaboratorResponse;
  employment: EmploymentEntity;
  job: JobEntity;
  attendanceReport: CollaboratorAttendanceReport;
  salaryData: SalaryDataEntity;
}

export interface PayrollEstimateRelevantValues {
  fixedIncomeDiscounts: number;
  nominalHourlyWage: number;
  attendanceProportion: number;
  averageOrdinaryIncomeHourly: number;
  minOrdinaryIncomeDaily: number;
  minOrdinaryIncomeHourly: number;
  mealDays: number;
  isrBase: number;
  employerImssRate: number;
}
