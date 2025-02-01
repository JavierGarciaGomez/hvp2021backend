import { BaseDTO } from "./base.dto";
import { JobProps } from "../../domain/entities";
import { HRPaymentType } from "../../domain";

export class JobDTO implements BaseDTO {
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
  paymentType: HRPaymentType = HRPaymentType.SALARY;
  sortingOrder: number = 99;
  title!: string;
  incomeMultiplier: number = 1;
  expectedComissionsPercentage: number = 0.4;
  expectedMinimumIncome: number = 0; // expected minimum ordinary income
  expressBranchCompensation: number = 0;
  constructor({ ...props }: JobProps) {
    Object.assign(this, props);
  }

  static create(data: JobProps): JobDTO {
    const errors = [];

    const { annualRaisePercent, baseIncome, paymentType, title } = data;

    if (annualRaisePercent === undefined) {
      errors.push("Annual raise percent is required");
    }
    if (baseIncome === undefined) {
      errors.push("Base income is required");
    }
    if (!paymentType) {
      errors.push("Payment type is required");
    }
    if (!title) {
      errors.push("Title is required");
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
