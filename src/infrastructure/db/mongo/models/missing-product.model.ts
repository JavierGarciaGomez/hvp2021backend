import mongoose, { ObjectId, Schema } from "mongoose";
import { MissingProductEntity, MissingProductProps } from "../../../../domain";

export interface MissingProductDocument
  extends Omit<MissingProductEntity, "collaborator">,
    Document {
  collaborator: ObjectId;
}

const MissingProductSchema: Schema = new Schema<MissingProductDocument>(
  {
    date: { type: Date, required: true },
    missingProduct: { type: String, required: true },
    description: { type: String },
    collaborator: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const MissingProductModel = mongoose.model<MissingProductDocument>(
  "MissingProduct",
  MissingProductSchema
);
