import { Schema } from "mongoose";
import { PaymentMethod } from "../enums/paymentMethod.enum";

export interface MoneyInDrawerVO {
  paymentMethod: PaymentMethod;
  amount: number;
  accountDestination: string;
}

export const moneyInDrawerSchema = new Schema({
  paymentMethod: {
    type: String,
    required: true,
    enum: Object.values(PaymentMethod),
  },
  amount: { type: Number, required: true },
  accountDestination: { type: String, required: true },
});
