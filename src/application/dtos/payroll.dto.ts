import { BaseDTO } from "./base.dto";
import {
  BaseEntity,
  EmploymentProps,
  JobProps,
  PayrollProps,
} from "../../domain/entities";
import {
  ExtraCompensationVO,
  HRPaymentType,
  OtherDeductionsVO,
  PayrollStatus,
} from "../../domain";

export class PayrollDTO implements BaseDTO, BaseEntity {
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

  constructor({ ...props }: PayrollProps) {
    Object.assign(this, props);
  }

  static create(data: PayrollProps): PayrollDTO {
    const errors = [];

    const {
      collaboratorId,
      jobId,
      collaboratorFullName,
      collaboratorCode,
      curp,
      socialSecurityNumber,
      rfcNumber,
    } = data;

    if (collaboratorId === undefined) {
      errors.push("Collaborator ID is required");
    }
    if (jobId === undefined) {
      errors.push("Job ID is required");
    }
    if (collaboratorFullName === undefined) {
      errors.push("Collaborator full name is required");
    }
    if (collaboratorCode === undefined) {
      errors.push("Collaborator code is required");
    }
    if (curp === undefined) {
      errors.push("CURP is required");
    }
    if (socialSecurityNumber === undefined) {
      errors.push("Social security number is required");
    }
    if (rfcNumber === undefined) {
      errors.push("RFC number is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new PayrollDTO({ ...data });
  }

  static update(data: PayrollProps): PayrollDTO {
    return this.validate(data);
  }

  private static validate(data: PayrollProps): PayrollDTO {
    return new PayrollDTO({ ...data });
  }
}
