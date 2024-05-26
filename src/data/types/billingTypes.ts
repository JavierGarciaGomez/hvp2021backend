import { Schema } from "mongoose";
import { Branch } from "./branch";

export interface CustomerRFC extends Document {
  _id?: Schema.Types.ObjectId;
  name: string;
  rfc: string;
  invoice_usage: string;
  fiscal_regime: string;
  postal_code: string;
  email: string;
  phone_number: string;
  isValidated: boolean;
  createdAt?: string;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: string;
  updatedBy?: Schema.Types.ObjectId;
}
export interface InvoiceUsage {
  id: string;
  name: string;
  value: string;
  moral: boolean;
  natural: boolean;
}

export interface FiscalRegime {
  id: string;
  name: string;
  value: string;
  moral: boolean;
  natural: boolean;
}

export interface PaymentMethod {
  id: string;
  name: string;
  value: string;
}
export interface BillCreationInfo extends Document {
  _id?: Schema.Types.ObjectId;
  bill_date: Date;
  customer_rfc: Schema.Types.ObjectId;
  branch: Branch;
  document_number: string;
  status: BillCreationInfoStatus;
  total: number;
  is_documented: boolean;
  payment_method: string;
  createdAt?: string;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: string;
  updatedBy?: Schema.Types.ObjectId;
}

export enum BillCreationInfoStatus {
  PENDING = "PENDING",
  DONE = "DONE",
  OBSERVED = "OBSERVED",
  REJECTED = "REJECTED",
}
