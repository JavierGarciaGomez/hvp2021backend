import { Schema } from "mongoose";
import { TransactionType } from "../enums";

export interface LinkedTransactionVO {
  transactionId: string;
  transactionType: TransactionType;
}

export const linkedTransactionSchema = new Schema({
  transactionId: { type: Schema.Types.ObjectId, required: true },
  transactionType: {
    type: String,
    required: true,
    enum: Object.values(TransactionType),
  },
});
