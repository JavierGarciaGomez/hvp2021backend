import mongoose, { Schema } from "mongoose";
import {
  SalaryDataDocument,
  saleLineSchema,
  TaxCode,
} from "../../../../domain";
import { SaleDocument } from "../../../../domain/entities/sale.entity";
import { linkedTransactionSchema } from "../../../../domain/value-objects/linkedTransaction.vo";

const SaleSchema: Schema = new Schema<SaleDocument>(
  {
    transactionDate: { type: Date, required: true },
    accountId: { type: Schema.Types.ObjectId, ref: "Account", required: true },
    subTotal: { type: Number, required: true },
    totalTax: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    saleNumber: { type: String, required: true },
    requiresCFDI: { type: Boolean, required: true },
    hasCFDI: { type: Boolean, required: true },
    cfdiData: { type: Object, required: true },
    customerId: {
      type: Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    dueDate: { type: Date, required: true },
    terms: { type: String, required: true },
    status: { type: String, required: true },
    amountPaid: { type: Number, required: true },
    balance: { type: Number, required: true },
    lineItems: [saleLineSchema],
    accountingClass: { type: String, required: true },
    transactionIds: [linkedTransactionSchema],
    costCenterId: {
      type: Schema.Types.ObjectId,
      required: true,
    },
    taxCode: { type: String, required: true, enum: TaxCode },
    currency: { type: String, required: true },
    discountPercentage: { type: Number, required: true },
    discountAmount: { type: Number, required: true },
  },
  {
    timestamps: true,
  }
);

export const SaleModel = mongoose.model<SaleDocument>("Sale", SaleSchema);
