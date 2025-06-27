import { Document, Schema } from "mongoose";
import { HRAttendanceSource, HRPaymentType } from "../enums";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import { ExtraCompensationVO, OtherDeductionVO } from "../value-objects";

export interface EmploymentBase extends newBaseEntityProps {
  collaboratorId: string | Schema.Types.ObjectId;
  jobId: string | Schema.Types.ObjectId;
  employmentStartDate: Date | string;
  employmentEndDate?: Date | string;
  isActive: boolean;
  paymentType: HRPaymentType;
  attendanceSource: HRAttendanceSource;
  weeklyHours: number;
  dailyWorkingHours: number;
  workWeekRatio: number;
  seniorityBonusPercentage: number;
  commissionBonusPercentage: number;
  employmentGuaranteedIncome: number;
  employmentFixedIncomeByJob: number;
  additionalRoleFixedIncome: number;
  complementaryFixedIncome: number;
  employmentDegreeBonus: number;
  totalFixedIncome: number;
  nominalDailyFixedIncome: number;
  nominalHourlyFixedIncome: number;
  effectiveDailyFixedIncome: number;
  effectiveHourlyFixedIncome: number;
  employmentHourlyRate: number;
  averageCommissionsPerScheduledHour: number;
  averageOrdinaryIncomePerScheduledHour: number;
  trainingSupport: number;
  physicalActivitySupport: number;
  contributionBaseSalary: number;
  extraCompensations: ExtraCompensationVO[];
  otherDeductions: OtherDeductionVO[];
}

export interface EmploymentProps extends EmploymentBase {
  id?: string;
  createdBy?: string;
  updatedBy?: string;
  collaboratorId: string;
  jobId: string;
  employmentStartDate: string;
  employmentEndDate?: string;
}

export interface EmploymentDocument extends EmploymentBase, Document {
  id: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  collaboratorId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
  employmentStartDate: Date;
  employmentEndDate?: Date;
}

export class EmploymentEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  collaboratorId!: string;
  jobId!: string;
  employmentStartDate!: Date;
  employmentEndDate?: Date;
  isActive!: boolean;
  paymentType: HRPaymentType = HRPaymentType.SALARY;
  attendanceSource!: HRAttendanceSource;
  weeklyHours!: number;
  dailyWorkingHours!: number;
  workWeekRatio!: number;
  seniorityBonusPercentage: number = 0;
  commissionBonusPercentage: number = 0;
  employmentGuaranteedIncome!: number;
  employmentFixedIncomeByJob: number = 0;
  additionalRoleFixedIncome: number = 0;
  complementaryFixedIncome: number = 0;
  employmentDegreeBonus: number = 0;
  employmentHourlyRate: number = 0;
  totalFixedIncome: number = 0;
  nominalDailyFixedIncome: number = 0;
  nominalHourlyFixedIncome: number = 0;
  effectiveDailyFixedIncome: number = 0;
  effectiveHourlyFixedIncome: number = 0;
  averageCommissionsPerScheduledHour: number = 0;
  averageOrdinaryIncomePerScheduledHour: number = 0;
  trainingSupport: number = 0;
  physicalActivitySupport: number = 0;
  contributionBaseSalary: number = 0;
  extraCompensations: ExtraCompensationVO[] = [];
  otherDeductions: OtherDeductionVO[] = [];

  constructor(props: EmploymentProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: EmploymentDocument) {
    const data = document.toObject<EmploymentDocument>();
    const { _id, __v, ...rest } = data;
    return new EmploymentEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
      collaboratorId: data.collaboratorId?.toString(),
      jobId: data.jobId?.toString(),
      employmentStartDate: data.employmentStartDate.toISOString(),
      employmentEndDate: data.employmentEndDate?.toISOString(),
    });
  }
}

export interface EmploymentResponse extends EmploymentEntity {}
