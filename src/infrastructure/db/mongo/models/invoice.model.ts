import { Schema, model } from "mongoose";
import { InvoiceDocument } from "../../../../domain";

const invoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceNumber: { type: String, required: true },
    invoiceDate: { type: Date, required: true },
    // customerId: { type: Schema.Types.ObjectId, required: true },
    dueDate: { type: Date, required: true },
    terms: { type: String, required: true },
    status: { type: String, required: true },
    currency: { type: String, required: true },
    subTotal: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    taxCode: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    balance: { type: Number, required: true },
    amountPaid: { type: Number, required: true },
    // lineItems: { type: [invoiceLineItemSchema], required: true },
    paymentMethod: { type: String, required: true },
    accountId: { type: String, required: true },
    class: { type: String, required: true },
    // transactionIds: { type: [Schema.Types.ObjectId], required: true },
    // costCenterId: { type: Schema.Types.ObjectId, required: true },
    isBilled: { type: Boolean, required: true },
    requiresBill: { type: Boolean, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const InvoiceModel = model<InvoiceDocument>("Invoice", invoiceSchema);
