import { HRPaymentType } from "../enums";
import { Schema } from "mongoose";

export interface PayrollConcept {
  name: string;
  description?: string;
  amount: number;
}

export const payrollConceptSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  amount: { type: Number, required: true },
});

export interface PayrollGeneralData {
  fullName: string;
  collaboratorCode: string;
  curp?: string;
  socialSecurityNumber?: string;
  rfcNumber?: string;
  jobTitle: string;
  paymentType: HRPaymentType;
  contributionBaseSalary: number;
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
  guaranteedIncomeCompensation: number;
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
  workedHours: number;
}
