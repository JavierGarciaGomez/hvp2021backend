import { BaseEntity, BaseEntityProps } from "./base.entity";
import { AddressVO, ExpenseLineVO, ExpensePaymentVO } from "../value-objects";
import { InvoicePaymentAllocationVO } from "../value-objects/invoice-payment-allocation.vo";
import { Schema } from "mongoose";

export interface InvoicePaymentProps extends BaseEntityProps {
  transactionDate: Date;
  totalAmount: number;
  paymentMethod:
    | "CASH"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "AMEX"
    | "CHECK"
    | "TRANSFER"
    | "OTHER";
  accountId: string;
  allocations: InvoicePaymentAllocationVO[];
  costCenterId: string;
  class: "NORMAL" | "ALTERNATIVE";
  customerId: string;
}

export interface InvoicePaymentDocument
  extends Omit<InvoicePaymentProps, "costCenterId" | "customerId">,
    Document {
  costCenterId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
}

export class InvoicePaymentEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  transactionDate!: Date;
  totalAmount!: number;
  paymentMethod!:
    | "CASH"
    | "CREDIT_CARD"
    | "DEBIT_CARD"
    | "AMEX"
    | "CHECK"
    | "TRANSFER"
    | "OTHER";
  accountId!: string;
  allocations!: InvoicePaymentAllocationVO[];
  costCenterId!: string;
  class!: "NORMAL" | "ALTERNATIVE";
  customerId!: string;

  constructor(props: InvoicePaymentProps) {
    Object.assign(this, props);
  }

  // Método de fábrica para crear instancias
  public static create(props: InvoicePaymentProps): InvoicePaymentEntity {
    return new InvoicePaymentEntity(props);
  }

  public static fromDocument(document: InvoicePaymentDocument) {
    return new InvoicePaymentEntity({
      ...document,
      costCenterId: document.costCenterId.toString(),
      customerId: document.customerId.toString(),
    });
  }
}
