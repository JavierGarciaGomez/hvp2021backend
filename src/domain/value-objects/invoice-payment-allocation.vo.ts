import { Schema } from "mongoose";
import { TransactionType } from "../enums/transactionType.enum";

export interface InvoicePaymentAllocationVO {
  transactionType: TransactionType;
  amount: number;
  allocationId: string;
}

export const invoicePaymentAllocationSchema = new Schema({
  transactionType: {
    type: String,
    required: true,
    enum: Object.values(TransactionType),
  },
  amount: { type: Number, required: true },
  allocationId: { type: Schema.Types.ObjectId, required: true },
});
