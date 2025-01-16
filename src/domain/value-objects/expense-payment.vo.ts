import { Schema } from "mongoose";

export interface ExpensePaymentVO {
  accountId: string; // id of the account that will do the payment
  lineNumber?: number; // line number of the payment
  amount: number; // amount of the payment
}

export const expensePaymentSchema = new Schema({
  accountId: { type: String, required: true },
  lineNumber: { type: Number, required: false },
  amount: { type: Number, required: true },
});
