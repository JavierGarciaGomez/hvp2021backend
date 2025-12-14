import { BaseEntity, BaseEntityProps } from "./base.entity";
import { AccountingClass, TaxCode } from "../enums";
import { SaleLineVO } from "../value-objects";
import { LinkedTransactionVO } from "../value-objects/linkedTransaction.vo";
import { Document, Schema } from "mongoose";

export interface SaleProps extends BaseEntityProps {
  // main info
  transactionDate: Date;
  accountId: string; // cash account that is impacted by the sale (accounts receivable)
  subTotal: number;
  totalTax: number;
  totalAmount: number;
  saleNumber: string; // ticket number

  // cfdi info
  requiresCFDI: boolean;
  hasCFDI: boolean;
  cfdiData?: {
    cfdiId: string;
    cfdiDate: Date;
    cfdiNumber: string;
  }[];

  // payable
  customerId: string; // required if is payable or has CFDI
  dueDate?: Date;
  terms?: string;

  // payment info
  status: string;
  amountPaid: number;
  balance: number;

  // lines
  lineItems: SaleLineVO[];

  // accounting info
  accountingClass: AccountingClass;
  transactionIds: LinkedTransactionVO[];
  costCenterId: string;
  taxCode: TaxCode;

  // other info
  currency: string;
  discountPercentage: number;
  discountAmount: number;
}

export interface SaleDocument
  extends Omit<SaleProps, "id" | "accountId" | "customerId" | "costCenterId">,
    Document {
  accountId: Schema.Types.ObjectId;
  customerId: Schema.Types.ObjectId;
  costCenterId: Schema.Types.ObjectId;
}

export class SaleEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  transactionDate!: Date;
  accountId!: string;
  subTotal!: number;
  totalTax!: number;
  totalAmount!: number;
  saleNumber!: string;
  requiresCFDI!: boolean;
  hasCFDI!: boolean;
  cfdiData?: {
    cfdiId: string;
    cfdiDate: Date;
    cfdiNumber: string;
  }[];
  customerId!: string;
  dueDate?: Date;
  terms?: string;
  status!: string;
  amountPaid!: number;
  balance!: number;
  lineItems!: SaleLineVO[];
  accountingClass!: AccountingClass;
  transactionIds!: LinkedTransactionVO[];
  costCenterId!: string;
  taxCode!: TaxCode;
  currency!: string;
  discountPercentage!: number;
  discountAmount!: number;

  constructor(props: SaleProps) {
    Object.assign(this, props);
  }

  // Método de fábrica para crear instancias
  public static create(props: SaleProps): SaleEntity {
    return new SaleEntity(props);
  }

  public static fromDocument(document: SaleDocument) {
    const plainObject: Omit<
      SaleProps,
      "accountId" | "customerId" | "costCenterId"
    > = document.toObject();

    const newSaleEntity = new SaleEntity({
      ...plainObject,
      accountId: document.accountId.toString(),
      customerId: document.customerId.toString(),
      costCenterId: document.costCenterId.toString(),
      transactionDate: document.transactionDate,
    });
    return newSaleEntity;
  }
}
