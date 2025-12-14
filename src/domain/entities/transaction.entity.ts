import { BaseEntity, BaseEntityProps } from "./base.entity";
import { AccountingClass } from "../enums";
import { TransactionLineVO } from "../value-objects";
import { LinkedTransactionVO } from "../value-objects/linkedTransaction.vo";
import { Schema } from "mongoose";

export interface TransactionProps extends BaseEntityProps {
  transactionSource: LinkedTransactionVO;
  transactionDate: Date; // date as YYYY-MM-DD
  transactionDatetime: Date; // date as YYYY-MM-DD HH:MM:SS
  totalAmount: number;
  costCenterId: string;
  class: AccountingClass;
  transactionLines: TransactionLineVO[];
}

export interface TransactionDocument
  extends Omit<TransactionProps, "costCenterId">,
    Document {
  costCenterId: Schema.Types.ObjectId;
}

export class TransactionEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  transactionSource!: LinkedTransactionVO;
  transactionDate!: Date;
  transactionDatetime!: Date;
  totalAmount!: number;
  costCenterId!: string;
  class!: AccountingClass;
  transactionLines!: TransactionLineVO[];

  constructor(props: TransactionProps) {
    Object.assign(this, props);
  }

  public static create(props: TransactionProps): TransactionEntity {
    return new TransactionEntity(props);
  }

  public static fromDocument(document: TransactionDocument) {
    return new TransactionEntity({
      ...document,
      costCenterId: document.costCenterId.toString(),
    });
  }
}
