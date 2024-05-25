import { Schema } from "mongoose";

export interface CustomerRFC extends Document {
  _id?: Schema.Types.ObjectId;
  name: string;
  rfc: string;
  invoice_usage: string;
  fiscal_regime: string;
  postal_code: string;
  isValidated: boolean;
  createdAt?: string;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: string;
  updatedBy?: Schema.Types.ObjectId;
}
