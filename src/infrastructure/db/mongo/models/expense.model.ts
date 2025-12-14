import { Schema, model } from "mongoose";
import {
  ExpenseDocument,
  expenseLineSchema,
  expensePaymentSchema,
} from "../../../../domain";

const expenseSchema = new Schema<ExpenseDocument>(
  {
    expenseLines: { type: [expenseLineSchema], required: true },
    itShouldBeBilled: { type: Boolean, required: true },
    isBilled: { type: Boolean, required: true },
    expensePayments: { type: [expensePaymentSchema], required: true },
    supplierId: { type: String, required: true },
    referenceNumber: { type: String, required: true },
    transactionDate: { type: Date, required: true },
    subtotal: { type: Number, required: true },
    taxAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    status: { type: String, required: true },
    class: { type: String, required: true },
    costCenterId: { type: String, required: true },
    requiresBill: { type: Boolean, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const ExpenseModel = model<ExpenseDocument>("Expense", expenseSchema);
