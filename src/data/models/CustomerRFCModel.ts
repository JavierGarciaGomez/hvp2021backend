import { Schema, model } from "mongoose";
import { CustomerRFC } from "../types/billingTypes";

const customerRFCSchema = new Schema<CustomerRFC>(
  {
    name: { type: String, required: true },
    rfc: { type: String, required: true },
    invoice_usage: { type: String, required: true },
    fiscal_regime: { type: String, required: true },
    postal_code: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    isValidated: { type: Boolean, required: true, default: false },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  { timestamps: true }
);

const CustomerRFCModel = model<CustomerRFC>("CustomerRFC", customerRFCSchema);

export default CustomerRFCModel;
