import { BaseEntity, BaseEntityProps } from "./base.entity";
import { ExpenseLineVO, ExpensePaymentVO } from "../value-objects";
import { AccountingClass } from "../enums";

export interface ExpenseProps extends BaseEntityProps {
  expenseLines: ExpenseLineVO[];
  itShouldBeBilled: boolean;
  isBilled: boolean;
  expensePayments: ExpensePaymentVO[];
  supplierId: string;
  referenceNumber: string;
  transactionDate: Date;
  subtotal: number;
  taxAmount: number;
  totalAmount: number;
  status: "PENDING" | "PAID" | "CANCELLED";
  class: AccountingClass;
  costCenterId: string;
  requiresBill: boolean;
}

export interface ExpenseDocument extends ExpenseProps, Document {}

export class ExpenseEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  expenseLines!: ExpenseLineVO[];
  itShouldBeBilled!: boolean;
  isBilled!: boolean;
  expensePayments!: ExpensePaymentVO[];
  supplierId!: string;
  referenceNumber!: string;
  transactionDate!: Date;
  subtotal!: number;
  taxAmount!: number;
  totalAmount!: number;
  status!: "PENDING" | "PAID" | "CANCELLED";
  class!: AccountingClass;
  costCenterId!: string;
  requiresBill!: boolean;

  constructor(props: ExpenseProps) {
    Object.assign(this, props);
  }

  // Método de fábrica para crear instancias
  public static create(props: ExpenseProps): ExpenseEntity {
    return new ExpenseEntity(props);
  }

  public static fromDocument(document: ExpenseDocument) {
    return new ExpenseEntity({
      ...document,
    });
  }
}
