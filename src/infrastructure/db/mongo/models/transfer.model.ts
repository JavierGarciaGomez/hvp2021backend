import { Schema, model } from "mongoose";
import {
  AccountingClass,
  InvoicePaymentDocument,
  PaymentMethod,
} from "../../../../domain";
import { invoicePaymentAllocationSchema } from "../../../../domain/value-objects/invoice-payment-allocation.vo";

const invoicePaymentSchema = new Schema<InvoicePaymentDocument>(
  {
    transactionDate: { type: Date, required: true },
    totalAmount: { type: Number, required: true },
    paymentMethod: {
      type: String,
      required: true,
      enum: Object.values(PaymentMethod),
    },
    accountId: { type: String, required: true },
    allocations: { type: [invoicePaymentAllocationSchema], required: true },
    costCenterId: { type: Schema.Types.ObjectId, required: true },
    class: {
      type: String,
      required: true,
      enum: Object.values(AccountingClass),
    },
    customerId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Customer",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const InvoicePaymentModel = model<InvoicePaymentDocument>(
  "InvoicePayment",
  invoicePaymentSchema
);
