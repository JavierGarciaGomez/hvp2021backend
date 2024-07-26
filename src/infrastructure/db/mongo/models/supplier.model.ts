import mongoose, { Schema } from "mongoose";
import { SupplierEntity } from "../../../../domain";

export interface SupplierDocument extends SupplierEntity, Document {}

const SupplierSchema: Schema = new Schema<SupplierDocument>(
  {
    name: { type: String, required: true },
    legalName: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const SupplierModel = mongoose.model<SupplierDocument>(
  "Supplier",
  SupplierSchema
);
