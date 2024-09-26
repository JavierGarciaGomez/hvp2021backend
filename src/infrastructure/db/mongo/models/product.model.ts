import mongoose, { Schema } from "mongoose";
import { ProductDocument } from "../../../../domain";

const ProductSchema: Schema = new Schema<ProductDocument>(
  {
    name: { type: String, required: true },
    description: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const ProductModel = mongoose.model<ProductDocument>(
  "Product",
  ProductSchema
);
