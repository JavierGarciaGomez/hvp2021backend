import { BaseDTO } from "./base.dto";
import { BaseEntity, CommissionableServiceProps } from "../../domain/entities";
import { CommissionCalculationType } from "../../domain";
import { BaseError } from "../../shared";

export class CommissionableServiceDTO implements BaseDTO, BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  name!: string;
  commissionCalculationType!: CommissionCalculationType;
  basePrice: number = 0;
  baseRate: number = 0;
  maxRate: number = 0;
  allowSalesCommission: boolean = false;
  baseCommission: number = 0;
  maxCommission: number = 0;
  isActive: boolean = true;

  constructor({ ...props }: CommissionableServiceProps) {
    Object.assign(this, props);
  }

  static create(data: CommissionableServiceProps): CommissionableServiceDTO {
    return this.validate(data);
  }

  static update(data: CommissionableServiceProps): CommissionableServiceDTO {
    return this.validate(data);
  }

  private static validate(
    data: CommissionableServiceProps
  ): CommissionableServiceDTO {
    const errors = [];

    const {
      name,
      commissionCalculationType,
      basePrice,
      baseRate,
      maxRate,
      baseCommission,
      maxCommission,
    } = data;

    if (name === undefined) {
      errors.push("Name is required");
    }
    if (commissionCalculationType === undefined) {
      errors.push("Commission calculation type is required");
    }

    if (commissionCalculationType === CommissionCalculationType.PROPORTIONAL) {
      if (!baseRate || baseRate <= 0) {
        errors.push("Base rate must be greater than 0");
      }
      if (!maxRate || maxRate <= 0 || maxRate >= 50) {
        errors.push("Max rate must be greater than 0 and less than 50");
      }
    }

    if (commissionCalculationType === CommissionCalculationType.FIXED) {
      if (!baseCommission || baseCommission <= 0) {
        errors.push("Base commission must be greater than 0");
      }
      if (!maxCommission || maxCommission <= 0) {
        errors.push("Max commission must be greater than 0");
      }
    }
    if (errors.length) {
      throw BaseError.badRequest(errors.join(", "));
    }

    return new CommissionableServiceDTO({ ...data });
  }
}
