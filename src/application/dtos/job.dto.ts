import { BaseDTO } from "./base.dto";
import { JobProps } from "../../domain/entities";
import { PaymentType } from "../../domain";

export class JobDTO implements BaseDTO {
  active: boolean;
  annualRaisePercent: number;
  baseIncome?: number;
  description?: string;
  hourlyRate?: number;
  minimumIncome?: number;
  paymentType: PaymentType;
  title: string;
  sortingOrder: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    active,
    annualRaisePercent,
    baseIncome,
    description,
    hourlyRate,
    minimumIncome,
    paymentType,
    title,
    sortingOrder,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: JobProps) {
    this.active = active;
    this.annualRaisePercent = annualRaisePercent;
    this.baseIncome = baseIncome;
    this.description = description;
    this.hourlyRate = hourlyRate;
    this.minimumIncome = minimumIncome;
    this.paymentType = paymentType;
    this.title = title;
    this.sortingOrder = sortingOrder;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
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
