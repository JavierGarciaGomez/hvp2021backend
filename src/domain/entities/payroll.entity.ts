import { Document, Schema } from "mongoose";
import { HRPaymentType, PayrollStatus } from "../enums";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import { ExtraCompensationVO, OtherDeductionsVO } from "../value-objects";

export interface PayrollBase extends newBaseEntityProps {
  // references
  collaboratorId: string | Schema.Types.ObjectId;
  employmentId: string | Schema.Types.ObjectId;
  // collaboratorData
  collaboratorFullName: string;
  collaboratorCode: string;
  curp: string;
  socialSecurityNumber: string;
  rfcNumber: string;
  // jobData
  jobTitle: string;
  paymentType: HRPaymentType;
  contributionBaseSalary: number;
  collaboratorStartDate: Date;
  collaboratorEndDate: Date;
  // payrollData
  payrollStartDate: Date;
  payrollEndDate: Date;
  paymentDate: Date;
  sickLeaveDays: number;
  absencesDays: number;
  payrollStatus: PayrollStatus;
  // INCOME
  // income - fixed
  fixedIncome: number;
  // income - comissions
  comissions: number;
  // income - similarToComissions
  vacationsCompensation: number;
  minimumOrdinaryIncomeCompensation: number;
  justifiedAbsencesCompensation: number;
  expressBranchCompensation: number;
  // income - legal allowances
  yearEndBonus: number;
  vacationBonus: number;
  profitSharing: number;
  employmentSubsidy: number;
  // income - extra legal compensations
  extraHoursSinglePlay: number;
  extraHoursDoublePlay: number;
  extraHoursTriplePlay: number;
  sundayBonusExtraPay: number;
  holidayOrRestExtraPay: number;
  // income - company benefits
  mealCompensation: number;
  receptionBonus: number;
  degreeBonus: number;
  punctualityBonus: number;
  trainingSupport: number;
  physicalActivitySupport: number;
  extraCompensations: ExtraCompensationVO[];
  specialCompensation: number;
  // DEDUCTIONS
  incomeTaxWithholding: number;
  socialSecurityWithholding: number;
  infonavitLoanWithholding: number;
  otherDeductions: OtherDeductionsVO[];
  // TOTAL
  totalIncome: number;
  totalDeductions: number;
  netPay: number;
}

export interface PayrollProps extends PayrollBase {
  id?: string;
  createdBy?: string;
  updatedBy?: string;
  collaboratorId: string;
  jobId: string;
}

export interface PayrollDocument extends PayrollBase, Document {
  id: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  collaboratorId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
}

export class PayrollEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  collaboratorId!: string;
  employmentId!: string;
  // collaboratorData
  collaboratorFullName!: string;
  collaboratorCode!: string;
  curp!: string;
  socialSecurityNumber!: string;
  rfcNumber!: string;
  // jobData
  jobTitle!: string;
  paymentType!: HRPaymentType;
  contributionBaseSalary!: number;
  collaboratorStartDate!: Date;
  collaboratorEndDate!: Date;
  // payrollData
  payrollStartDate!: Date;
  payrollEndDate!: Date;
  paymentDate!: Date;
  sickLeaveDays: number = 0;
  absencesDays: number = 0;
  payrollStatus: PayrollStatus = PayrollStatus.Pending;
  // INCOME
  // income - fixed
  fixedIncome: number = 0;
  // income - comissions
  comissions: number = 0;
  // income - similarToComissions
  vacationsCompensation: number = 0;
  minimumOrdinaryIncomeCompensation: number = 0;
  justifiedAbsencesCompensation: number = 0;
  expressBranchCompensation: number = 0;
  // income - legal allowances
  yearEndBonus: number = 0;
  vacationBonus: number = 0;
  profitSharing: number = 0;
  employmentSubsidy: number = 0;
  // income - extra legal compensations
  extraHoursSinglePlay: number = 0;
  extraHoursDoublePlay: number = 0;
  extraHoursTriplePlay: number = 0;
  sundayBonusExtraPay: number = 0;
  holidayOrRestExtraPay: number = 0;
  // income - company benefits
  mealCompensation: number = 0;
  receptionBonus: number = 0;
  degreeBonus: number = 0;
  punctualityBonus: number = 0;
  trainingSupport: number = 0;
  physicalActivitySupport: number = 0;
  extraCompensations: ExtraCompensationVO[] = [];
  specialCompensation: number = 0;
  // DEDUCTIONS
  incomeTaxWithholding: number = 0;
  socialSecurityWithholding: number = 0;
  infonavitLoanWithholding: number = 0;
  otherDeductions: OtherDeductionsVO[] = [];
  // TOTAL
  totalIncome: number = 0;
  totalDeductions: number = 0;
  netPay: number = 0;

  constructor(props: PayrollProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: PayrollDocument) {
    const data = document.toObject<PayrollDocument>();
    const { _id, __v, ...rest } = data;
    return new PayrollEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
      collaboratorId: data.collaboratorId?.toString(),
      jobId: data.jobId?.toString(),
    });
  }
}

export interface PayrollResponse extends PayrollEntity {}
