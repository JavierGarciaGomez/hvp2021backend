import { Document, Schema } from "mongoose";
import { PaymentType } from "./../enums/job.enums";
import { BaseEntity, BaseEntityProps, newBaseEntityProps } from "./base.entity";

export interface JobPropsBase extends newBaseEntityProps {
  active: boolean;
  annualRaisePercent: number; // todo: legacy
  quarterlyComissionRaisePercent: number; // todo: legacy

  baseIncome?: number; // fixed perception --- calculate
  description?: string;
  hourlyRate?: number;
  minimumIncome?: number; // minimum ordinary income --- calculate
  paymentType: PaymentType;
  sortingOrder: number;
  title: string;
  incomeMultiplier: number;
  expectedComissionsPercentage: number; // --- calculate
  expectedMinimumIncome: number; // expected minimum ordinary income --- calculate
  expressBranchCompensation: number;
}

export interface JobProps extends JobPropsBase {
  id?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface JobDocument extends JobPropsBase, Document {
  id: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
}

export class JobEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  active!: boolean;
  annualRaisePercent: number = 0.025;
  quarterlyComissionRaisePercent: number = 0.05;
  baseIncome?: number; // fixed perception
  description?: string;
  hourlyRate?: number;
  minimumIncome?: number; // minimum ordinary income
  paymentType: PaymentType = PaymentType.SALARY;
  sortingOrder: number = 99;
  title!: string;
  incomeMultiplier: number = 1;
  expectedComissionsPercentage: number = 0.4;
  expectedMinimumIncome: number = 0; // expected minimum ordinary income
  expressBranchCompensation: number = 0;

  constructor(props: JobProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: JobDocument) {
    const data = document.toObject<JobDocument>();
    const { _id, __v, ...rest } = data;
    return new JobEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
    });
  }
}
