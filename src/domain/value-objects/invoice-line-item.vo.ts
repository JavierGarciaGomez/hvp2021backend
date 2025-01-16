import { Schema } from "mongoose";

export interface InvoiceLineItemVO {
  lineNumber?: number;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  unitOfMeasure?: string;
  taxCode?: string;
  taxAmount?: number;
  totalAmount: number;
  discountPercentage?: number;
  discountAmount?: number;
  accountId?: string;
}

export const invoiceLineItemSchema = new Schema({
  lineNumber: { type: Number, required: false },
  description: { type: String, required: false },
  quantity: { type: Number, required: false },
  unitPrice: { type: Number, required: false },
  unitOfMeasure: { type: String, required: false },
  amount: { type: Number, required: false },
  taxCode: { type: String, required: false },
  taxAmount: { type: Number, required: false },
  totalAmount: { type: Number, required: true },
  discountPercentage: { type: Number, required: false },
  discountAmount: { type: Number, required: false },
  accountId: { type: String, required: false },
});
