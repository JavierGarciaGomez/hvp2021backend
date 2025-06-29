import {
  CollaboratorEntity,
  EmploymentEntity,
  JobEntity,
  PayrollEntity,
  SalaryDataEntity,
} from "../entities";
import { HRPaymentType } from "../enums";
import { CollaboratorAttendanceReport } from "./collaborator-attendance-report.rm";

// TODO
export interface PayrollEstimate {
  id?: string;
  collaboratorId: string;
  generalData: PayrollGeneralData;
  earnings: PayrollEarnings;
  deductions: PayrollDeductions;
  totals: PayrollTotals;
  contextData: PayrollContextData;
}

export interface PayrollGeneralData {
  fullName: string;
  collaboratorCode: string;
  curp: string;
  socialSecurityNumber: string;
  rfcNumber: string;
  jobTitle: string;
  paymentType: HRPaymentType;
  contributionBaseSalary: number;
  periodStartDate: Date;
  periodEndDate: Date;
}

export interface PayrollEarnings {
  halfWeekFixedIncome: number;
  commissions: number;
  vacationCompensation: number;
  expressBranchCompensation: number;
  mealCompensation: number;
  receptionBonus: number;
  punctualityBonus: number;
  absencesJustifiedByCompanyCompensation: number;
  specialBonuses: PayrollConcept[];
  guaranteedPerceptionCompensation: number;
  simpleOvertimeHours: number;
  doubleOvertimeHours: number;
  tripleOvertimeHours: number;
  sundayBonus: number;
  holidayOrRestExtraPay: number;
  traniningActivitySupport: number;
  physicalActivitySupport: number;
  extraFixedCompensations: PayrollConcept[];
  extraVariableCompensations: PayrollConcept[];
  vacationBonus: number;
  endYearBonus: number;
  profitSharing: number;
  employmentSubsidy: number;
}

export interface PayrollDeductions {
  incomeTaxWithholding: number;
  socialSecurityWithholding: number;
  otherFixedDeductions: PayrollConcept[];
  otherVariableDeductions: PayrollConcept[];
  nonCountedDaysDiscount: number;
  justifiedAbsencesDiscount: number;
  unjustifiedAbsencesDiscount: number;
  unworkedHoursDiscount: number;
  tardinessDiscount: number;
}

export interface PayrollConcept {
  name: string;
  description: string;
  amount: number;
}

export interface PayrollTotals {
  totalIncome: number;
  totalDeductions: number;
  netPay: number;
}

export interface PayrollContextData {
  periodDaysLength: number;
  halfWeekFixedIncome: number;
  averageOrdinaryIncomeDaily: number;

  attendanceRelatedDiscounts: number;
  attendanceFactor: number;
  employerImssRate: number;
}

export interface PayrollCollaboratorRawData {
  collaborator: CollaboratorEntity;
  employment: EmploymentEntity;
  job: JobEntity;
  attendanceReport: CollaboratorAttendanceReport;
  salaryData: SalaryDataEntity;
  totalCommissions: number;
}
