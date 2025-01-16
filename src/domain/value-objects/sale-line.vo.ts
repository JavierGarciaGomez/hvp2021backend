import { Schema } from "mongoose";
import { TaxCode } from "../enums";

export interface SaleLineVO {
  lineNumber?: number;
  description: string;
  totalAmount: number;
  taxCode: string;
  taxAmount: number;
  subtotal: number;
}

export const saleLineSchema = new Schema({
  lineNumber: { type: Number, required: false },
  description: { type: String, required: true },
  totalAmount: { type: Number, required: true },
  taxCode: {
    type: String,
    required: true,
    enum: Object.values(TaxCode),
    default: TaxCode.IVA,
  },
  taxAmount: { type: Number, required: true },
  subtotal: { type: Number, required: true },
});
