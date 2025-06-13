import { Document, Schema } from "mongoose";
import { HRPaymentType } from "./../enums/job.enums";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import { JobPromotionStatsVO } from "../value-objects";

export interface JobPropsBase extends newBaseEntityProps {
  active: boolean;
  annualRaisePercent: number; // todo: legacy
  quarterlyCommissionRaisePercent: number; // todo: legacy
  baseIncome?: number; // fixed perception --- calculate
  description?: string;
  hourlyRate?: number;
  minimumIncome?: number; // minimum ordinary income --- calculate
  paymentType: HRPaymentType;
  sortingOrder: number;
  title: string;
  incomeMultiplier: number;
  commissionRateAdjustment: number;
  expectedCommissionsPercentage: number; // --- calculate
  expectedMinimumIncome: number; // expected minimum ordinary income --- calculate
  expressBranchCompensation: number;
  promotionJobId?: string;
  quarterPromotionRequirements?: JobPromotionStatsVO;
  historicalPromotionRequirements?: JobPromotionStatsVO;
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
  quarterlyCommissionRaisePercent: number = 0.05;
  baseIncome?: number; // fixed perception
  description?: string;
  hourlyRate?: number;
  minimumIncome?: number; // minimum ordinary income
  paymentType: HRPaymentType = HRPaymentType.SALARY;
  sortingOrder: number = 99;
  title!: string;
  incomeMultiplier: number = 1;
  commissionRateAdjustment: number = 0.4;
  expectedCommissionsPercentage: number = 0.4;
  expectedMinimumIncome: number = 0; // expected minimum ordinary income
  expressBranchCompensation: number = 0;
  promotionJobId?: string;
  quarterPromotionRequirements?: JobPromotionStatsVO;
  historicalPromotionRequirements?: JobPromotionStatsVO;

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
