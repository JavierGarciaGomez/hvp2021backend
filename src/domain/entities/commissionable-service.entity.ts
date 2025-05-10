import { Schema, Document } from "mongoose";
import { CommissionCalculationType } from "../enums";
import { BaseEntity, newBaseEntityProps } from "./base.entity";

export interface CommissionableServiceBase extends newBaseEntityProps {
  name: string;
  commissionCalculationType: CommissionCalculationType;
  basePrice: number;
  baseRate: number;
  maxRate: number;
  allowSalesCommission: boolean;
  baseCommission: number;
  maxCommission: number;
  isActive: boolean;
}

export interface CommissionableServiceProps extends CommissionableServiceBase {
  id?: string;
  createdBy?: string;
  updatedBy?: string;
}

export interface CommissionableServiceDocument
  extends CommissionableServiceBase,
    Document {
  id: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export class CommissionableServiceEntity implements BaseEntity {
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
  constructor(props: CommissionableServiceProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: CommissionableServiceDocument) {
    const data = document.toObject<CommissionableServiceDocument>();
    const { _id, __v, ...rest } = data;
    return new CommissionableServiceEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
    });
  }
}
