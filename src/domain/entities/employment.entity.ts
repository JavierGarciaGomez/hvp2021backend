import { Document, Schema } from "mongoose";
import { HRPaymentType } from "../enums";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import { ExtraCompensationVO, OtherDeductionVO } from "../value-objects";

export interface EmploymentBase extends newBaseEntityProps {
  collaboratorId: string | Schema.Types.ObjectId;
  jobId: string | Schema.Types.ObjectId;
  employmentStartDate: Date | string;
  employmentEndDate?: Date | string;
  isActive: boolean;
  weeklyHours: number;
  paymentType: HRPaymentType;
  //
  seniorityBonusPercentage: number;
  commissionBonusPercentage: number;
  //
  fixedIncomeByPosition: number;
  additionalFixedIncome: number;
  fixedIncome: number;
  minimumOrdinaryIncome: number;
  //
  degreeBonus: number;
  receptionBonus: number;
  //
  trainingSupport: number;
  physicalActivitySupport: number;
  //
  contributionBaseSalary: number;
  averageOrdinaryIncome: number;
  averageIntegratedIncome: number;
  averageCommissionIncome: number;
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
  weeklyHours!: number;
  paymentType: HRPaymentType = HRPaymentType.SALARY;
  seniorityBonusPercentage: number = 0;
  commissionBonusPercentage: number = 0;
  //
  fixedIncomeByPosition: number = 0;
  additionalFixedIncome: number = 0;
  fixedIncome: number = 0;
  minimumOrdinaryIncome: number = 0;
  //
  degreeBonus: number = 0;
  receptionBonus: number = 0;
  //
  trainingSupport: number = 0;
  physicalActivitySupport: number = 0;
  //
  contributionBaseSalary: number = 0;
  averageOrdinaryIncome: number = 0;
  averageIntegratedIncome: number = 0;
  averageCommissionIncome: number = 0;
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
