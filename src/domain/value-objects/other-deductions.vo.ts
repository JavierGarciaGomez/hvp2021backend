import { Schema } from "mongoose";
import { PaymentMethod } from "../enums/paymentMethod.enum";
import { AccountingClass, PayrollIncomeType } from "../enums";

export interface OtherDeductionsVO {
  name: string;
  amount: number;
}

export const otherDeductionsSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});
