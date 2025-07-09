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
  halfWeekFixedIncome?: number;
  halfWeekHourlyPay?: number;
  additionalFixedIncomes: PayrollConcept[];
  commissions: number;
  punctualityBonus?: number;
  receptionBonus: number;
  expressBranchCompensation: number;
  vacationCompensation: number;
  specialBonuses: PayrollConcept[];
  guaranteedIncomeCompensation?: number;
  simpleOvertimeHours?: number;
  doubleOvertimeHours?: number;
  tripleOvertimeHours?: number;
  sundayBonus: number;
  holidayOrRestExtraPay: number;
  endYearBonus: number;
  vacationBonus: number;
  profitSharing?: number;
  employmentSubsidy?: number;
  traniningActivitySupport: number;
  physicalActivitySupport: number;
  extraVariableCompensations: PayrollConcept[];
  absencesJustifiedByCompanyCompensation?: number; // legacy
  mealCompensation?: number; // legacy
}

export interface PayrollDeductions {
  incomeTaxWithholding?: number;
  socialSecurityWithholding?: number;
  otherFixedDeductions?: PayrollConcept[];
  otherVariableDeductions?: PayrollConcept[];
  nonCountedDaysDiscount?: number;
  justifiedAbsencesDiscount?: number;
  unjustifiedAbsencesDiscount?: number;
  unworkedHoursDiscount?: number;
  tardinessDiscount?: number;
}

export interface PayrollTotals {
  totalIncome: number;
  totalDeductions: number;
  netPay: number;
}

export interface PayrollContextData {
  attendanceFactor: number;
  employerImssRate: number;
  workedHours: number;
}

// sorted by calculation
export interface AttendanceDiscounts {
  nonCountedDaysDiscount: number;
  justifiedAbsencesDiscount: number;
  unjustifiedAbsencesDiscount: number;
  unworkedHoursDiscount: number;
  tardinessDiscount: number;
}

export interface SimpleSalaryPayrollEarnings {
  halfWeekFixedIncome: number;
  additionalFixedIncomes: PayrollConcept[];
  commissions: number;
  receptionBonus: number;
  punctualityBonus: number;
  expressBranchCompensation: number;
  vacationCompensation: number;
  simpleOvertimeHours: number;
  doubleOvertimeHours: number;
  tripleOvertimeHours: number;
  sundayBonus: number;
  holidayOrRestExtraPay: number;
  vacationBonus: number;
  traniningActivitySupport: number;
  physicalActivitySupport: number;
}

export interface FrontendSalaryPayrollEarnings {
  specialBonuses: PayrollConcept[];
  endYearBonus: number;
  extraVariableCompensations: PayrollConcept[];
  profitSharing: number;
}

export interface incomeTaxConcepts {
  employmentSubsidy: number;
  incomeTaxWithholding: number;
}

export interface OtherDeductions {
  socialSecurityWithholding: number;
  otherFixedDeductions: PayrollConcept[];
  otherVariableDeductions: PayrollConcept[];
  employerSocialSecurityCost: number;
}
