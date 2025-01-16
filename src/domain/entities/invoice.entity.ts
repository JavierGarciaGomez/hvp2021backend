import { BaseEntity, BaseEntityProps } from "./base.entity";
import { AccountClassification, AccountType } from "../enums";
import { InvoiceLineItemVO, BankAccountVO } from "../value-objects";

export interface InvoiceProps extends BaseEntityProps {
  // type
  invoiceNumber: string;
  invoiceDate: Date;
  customerId: string;
  dueDate: Date;
  terms: string;
  status: string;
  currency: string;
  subTotal: number;
  totalTax: number;
  taxCode: string;
  discountPercentage: number;
  discountAmount: number;
  totalAmount: number;
  balance: number;
  amountPaid: number;
  lineItems: InvoiceLineItemVO[];
  paymentMethod: string;
  accountId: string;
  class: "normal" | "alternative";
  transactionIds: string[];
  costCenterId: string;
  isBilled: boolean;
  requiresBill: boolean;
}

export interface InvoiceDocument extends InvoiceProps, Document {}

export class InvoiceEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  invoiceNumber!: string;
  invoiceDate!: Date;
  customerId!: string;
  dueDate!: Date;
  terms!: string;
  status!: string;
  currency!: string;
  subTotal!: number;
  totalTax!: number;
  taxCode!: string;
  discountPercentage!: number;
  discountAmount!: number;
  totalAmount!: number;
  balance!: number;
  amountPaid!: number;
  lineItems!: InvoiceLineItemVO[];
  paymentMethod!: string;
  accountId!: string;
  class!: "normal" | "alternative";
  transactionIds!: string[];
  costCenterId!: string;

  constructor(props: InvoiceProps) {
    Object.assign(this, props);
  }

  // Método de fábrica para crear instancias
  public static create(props: InvoiceProps): InvoiceEntity {
    return new InvoiceEntity(props);
  }

  public static fromDocument(document: InvoiceDocument) {
    return new InvoiceEntity({
      ...document,
    });
  }
}
