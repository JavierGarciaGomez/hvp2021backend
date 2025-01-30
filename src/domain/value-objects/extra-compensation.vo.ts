import { Schema } from "mongoose";
import { PaymentMethod } from "../enums/paymentMethod.enum";
import { AccountingClass, PayrollIncomeType } from "../enums";

export interface ExtraCompensationVO {
  name: string;
  description?: string;
  attendanceRelated: boolean;
  amount: number;
  incomeType: PayrollIncomeType;
}

export const extraCompensationSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  attendanceRelated: { type: Boolean, required: false, default: true },
  amount: { type: Number, required: true },
  incomeType: {
    type: String,
    required: true,
    enum: Object.values(PayrollIncomeType),
    default: PayrollIncomeType.COMPANY_BENEFIT,
  },
});
