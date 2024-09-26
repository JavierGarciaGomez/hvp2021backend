import { PaymentType } from "./../enums/job.enums";
import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface JobProps extends BaseEntityProps {
  active: boolean;
  annualRaisePercent: number;
  baseIncome?: number;
  description?: string;
  hourlyRate?: number;
  minimumIncome?: number;
  paymentType: PaymentType;
  title: string;
}

export interface JobDocument extends JobProps, Document {}

export class JobEntity implements BaseEntity {
  id?: string;
  active: boolean;
  annualRaisePercent: number;
  baseIncome?: number;
  description?: string;
  hourlyRate?: number;
  minimumIncome?: number;
  paymentType: PaymentType;
  title: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    active,
    annualRaisePercent,
    baseIncome,
    description,
    hourlyRate,
    minimumIncome,
    paymentType,
    title,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: JobProps) {
    this.id = id;
    this.active = active;
    this.annualRaisePercent = annualRaisePercent;
    this.baseIncome = baseIncome;
    this.description = description;
    this.hourlyRate = hourlyRate;
    this.minimumIncome = minimumIncome;
    this.paymentType = paymentType;
    this.title = title;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(document: JobDocument) {
    return new JobEntity({
      id: document.id,
      active: document.active,
      annualRaisePercent: document.annualRaisePercent,
      baseIncome: document.baseIncome,
      description: document.description,
      hourlyRate: document.hourlyRate,
      minimumIncome: document.minimumIncome,
      paymentType: document.paymentType,
      title: document.title,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
