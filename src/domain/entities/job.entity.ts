import { Document, Schema } from "mongoose";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import { JobPromotionStatsVO } from "../value-objects";

export interface JobPropsBase extends newBaseEntityProps {
  active: boolean;
  description?: string;
  sortingOrder: number;
  title: string;
  commissionRateAdjustment: number;
  expressBranchCompensation: number;
  promotionJobId?: string;
  quarterPromotionRequirements?: JobPromotionStatsVO;
  historicalPromotionRequirements?: JobPromotionStatsVO;
  positionFactor: number;
  guarantedJobIncome?: number;
  jobFixedIncome?: number;
  fixedShareOfGuaranteedIncome: number;
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
  positionFactor: number = 1;
  guarantedJobIncome?: number; // minimum ordinary income
  jobFixedIncome?: number; // fixed perception
  expressBranchCompensation: number = 0;
  commissionRateAdjustment: number = 0.4;
  title!: string;
  description?: string;
  sortingOrder: number = 99;
  active!: boolean;
  promotionJobId?: string;
  quarterPromotionRequirements?: JobPromotionStatsVO;
  historicalPromotionRequirements?: JobPromotionStatsVO;
  fixedShareOfGuaranteedIncome: number = 0.4;

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
