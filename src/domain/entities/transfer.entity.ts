import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface TransferProps extends BaseEntityProps {
  transactionDate: Date; // date as YYYY-MM-DD
  transactionDatetime: Date; // date as YYYY-MM-DD HH:MM:SS
  toAccountId: string;
  fromAccountId: string;
  totalAmount: number;
  costCenterId: string;
  class: "normal" | "alternative";
}

export interface TransferDocument extends TransferProps, Document {}

export class TransferEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  transactionDate!: Date;
  transactionDatetime!: Date;
  toAccountId!: string;
  fromAccountId!: string;
  totalAmount!: number;
  costCenterId!: string;
  class!: "normal" | "alternative";

  constructor(props: TransferProps) {
    Object.assign(this, props);
  }

  public static create(props: TransferProps): TransferEntity {
    return new TransferEntity(props);
  }

  public static fromDocument(document: TransferDocument) {
    return new TransferEntity({
      ...document,
    });
  }
}
