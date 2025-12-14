import { BranchReconciliationStatus } from "../enums";
import { BaseEntity, BaseEntityProps } from "./base.entity";
import { Schema } from "mongoose";

export interface SimplifiedBranchCashReconciliationProps
  extends BaseEntityProps {
  branchId: string;
  cashierId: string;
  transactionDate: Date; // date as YYYY-MM-DD
  transactionDatetime: Date; // date as YYYY-MM-DD HH:MM:SS
  cashInDrawerStart: number;
  qvetCashInDrawer: number;
  cashInDrawerEnd: number;
  cashTransfer: number;
  closingCash: number;
  status: BranchReconciliationStatus;
  notes?: string;
}

export interface SimplifiedBranchCashReconciliationDocument
  extends Omit<
      SimplifiedBranchCashReconciliationProps,
      "id" | "branchId" | "cashierId" | "createdBy" | "updatedBy"
    >,
    Document {
  id: Schema.Types.ObjectId;
  branchId: Schema.Types.ObjectId;
  cashierId: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
}

export class SimplifiedBranchCashReconciliationEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  branchId!: string;
  cashierId!: string;
  transactionDate!: Date;
  transactionDatetime!: Date;
  cashInDrawerStart!: number;
  qvetCashInDrawer!: number;
  cashInDrawerEnd!: number;
  cashTransfer!: number;
  closingCash!: number;
  status!: BranchReconciliationStatus;
  notes?: string;

  constructor(props: SimplifiedBranchCashReconciliationProps) {
    Object.assign(this, props);
  }

  public static create(
    props: SimplifiedBranchCashReconciliationProps
  ): SimplifiedBranchCashReconciliationEntity {
    return new SimplifiedBranchCashReconciliationEntity(props);
  }

  public static fromDocument(
    document: SimplifiedBranchCashReconciliationDocument
  ) {
    return new SimplifiedBranchCashReconciliationEntity({
      id: document.id.toString(),
      branchId: document.branchId.toString(),
      cashierId: document.cashierId.toString(),
      transactionDate: document.transactionDate,
      transactionDatetime: document.transactionDatetime,
      cashInDrawerStart: document.cashInDrawerStart,
      qvetCashInDrawer: document.qvetCashInDrawer,
      cashInDrawerEnd: document.cashInDrawerEnd,
      cashTransfer: document.cashTransfer,
      closingCash: document.closingCash,
      status: document.status,
    });
  }
}
