import { Schema } from "mongoose";
import { PaymentMethod } from "../enums/paymentMethod.enum";
import { AccountingClass } from "../enums";

export interface ReconciliationExpenseVO {
  transactionDatetime: Date;
  supplierId: string;
  paymentMethod: PaymentMethod;
  amount: number;
  accountingClass: AccountingClass;
  description: string;
  accountSourceRef: string;
  expenseAccount: string;
  vatAccount: string;
  itCanBeBilled: boolean;
  isBilled: boolean;
  branchId: string;
}

export const reconciliationExpenseSchema = new Schema({
  transactionDatetime: { type: Date, required: true },
  supplierId: { type: String, required: true },
  paymentMethod: {
    type: String,
    required: true,
    enum: Object.values(PaymentMethod),
  },
  amount: { type: Number, required: true },
  accountingClass: {
    type: String,
    required: true,
    enum: Object.values(AccountingClass),
  },
  description: { type: String, required: true },
  accountSourceRef: { type: String, required: true },
  expenseAccount: { type: String, required: true },
  vatAccount: { type: String, required: true },
  itCanBeBilled: { type: Boolean, required: true },
  isBilled: { type: Boolean, required: true },
  branchId: { type: String, required: true },
});
