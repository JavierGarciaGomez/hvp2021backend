import { Schema } from "mongoose";

export interface TransactionLineVO {
  accountId: string;
  lineNumber?: number;
  debitAmount: number;
  creditAmount: number;
  balanceAmount: number;
}

export const transactionLineSchema = new Schema({
  accountId: { type: Schema.Types.ObjectId, required: true, ref: "Account" },
  lineNumber: { type: Number, required: false },
  debitAmount: { type: Number, required: true },
  creditAmount: { type: Number, required: true },
  balanceAmount: { type: Number, required: true },
});
