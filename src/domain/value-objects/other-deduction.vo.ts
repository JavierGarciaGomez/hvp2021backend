import { Schema } from "mongoose";
import { PaymentMethod } from "../enums/paymentMethod.enum";
import { AccountingClass, PayrollIncomeType } from "../enums";

export interface OtherDeductionVO {
  name: string;
  amount: number;
}

export const otherDeductionSchema = new Schema({
  name: { type: String, required: true },
  amount: { type: Number, required: true },
});
