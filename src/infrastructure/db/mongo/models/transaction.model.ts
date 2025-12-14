import { Schema, model } from "mongoose";
import {
  AccountingClass,
  InvoicePaymentDocument,
  PaymentMethod,
  TransactionDocument,
  transactionLineSchema,
} from "../../../../domain";
import { invoicePaymentAllocationSchema } from "../../../../domain/value-objects/invoice-payment-allocation.vo";
import { linkedTransactionSchema } from "../../../../domain/value-objects/linkedTransaction.vo";

const transactionSchema = new Schema<TransactionDocument>(
  {
    transactionSource: { type: linkedTransactionSchema, required: true },
    transactionDate: { type: Date, required: true },
    transactionDatetime: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    costCenterId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Branch",
    },
    class: {
      type: String,
      required: true,
      enum: Object.values(AccountingClass),
    },
    transactionLines: { type: [transactionLineSchema], required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const TransactionModel = model<TransactionDocument>(
  "Transaction",
  transactionSchema
);
