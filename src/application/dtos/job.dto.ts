import { BaseDTO } from "./base.dto";
import { JobProps } from "../../domain/entities";
import { JobPromotionStatsVO } from "../../domain";

export class JobDTO implements BaseDTO {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  active!: boolean;
  description?: string;
  sortingOrder: number = 99;
  title!: string;
  commissionRateAdjustment: number = 0.4;
  expressBranchCompensation: number = 0;
  promotionJobId?: string;
  quarterPromotionRequirements?: JobPromotionStatsVO;
  historicalPromotionRequirements?: JobPromotionStatsVO;
  positionFactor: number = 1;
  guaranteedJobIncome?: number;
  jobFixedIncome?: number;
  fixedShareOfGuaranteedIncome: number = 0.4;

  constructor({ ...props }: JobProps) {
    Object.assign(this, props);
  }

  static create(data: JobProps): JobDTO {
    const errors = [];

    const { title, active } = data;

    if (!title) {
      errors.push("Title is required");
    }
    if (active === undefined) {
      errors.push("Active status is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new JobDTO({ ...data });
  }

  static update(data: JobProps): JobDTO {
    return this.validate(data);
  }

  private static validate(data: JobProps): JobDTO {
    return new JobDTO({ ...data });
  }
}
