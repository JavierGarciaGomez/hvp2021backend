import { BaseDTO } from "./base.dto";

import { checkForErrors } from "../../shared";
import { AccountingClass, SaleLineVO, TaxCode } from "../../domain";
import { LinkedTransactionVO } from "../../domain/value-objects/linkedTransaction.vo";
import { SaleProps } from "../../domain/entities/sale.entity";

export class SaleDTO implements BaseDTO {
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

  constructor({ ...props }: SaleProps) {
    Object.assign(this, props);
  }

  static create(data: SaleProps): SaleDTO {
    const errors: string[] = [];

    const {
      transactionDate,
      accountId,
      subTotal,
      totalTax,
      totalAmount,
      saleNumber,
      requiresCFDI,
      hasCFDI,
      cfdiData,
      customerId,
      dueDate,
      terms,
      status,
      amountPaid,
      balance,
      lineItems,
      transactionIds,
      costCenterId,
      taxCode,
      currency,
      discountPercentage,
      discountAmount,
      accountingClass,
    } = data;

    if (!transactionDate) {
      errors.push("Transaction date is required");
    }

    if (!accountId) {
      errors.push("Account ID is required");
    }
    if (!subTotal) {
      errors.push("Subtotal is required");
    }
    if (!totalTax) {
      errors.push("Total tax is required");
    }

    checkForErrors(errors);

    return new SaleDTO({
      ...data,
    });
  }

  static update(data: SaleProps): SaleDTO {
    const {
      transactionDate,
      accountId,
      subTotal,
      totalTax,
      totalAmount,
      saleNumber,
      requiresCFDI,
      hasCFDI,
      cfdiData,
      customerId,
      dueDate,
      terms,
      status,
      amountPaid,
      balance,
      lineItems,
      transactionIds,
      costCenterId,
      taxCode,
      currency,
      discountPercentage,
      discountAmount,
    } = data;
    const errors: string[] = [];

    checkForErrors(errors);
    return new SaleDTO({
      ...data,
    });
  }

  private static validate(data: SaleProps): SaleDTO {
    return new SaleDTO({ ...data });
  }
}
