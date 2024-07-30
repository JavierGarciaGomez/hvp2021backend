import mongoose, { Schema, SchemaOptions } from "mongoose";
import { BaseOptionVO } from "../../../domain";

export interface BaseOptionDocument extends BaseOptionVO, Document {}

const baseOptionSchema = new Schema<BaseOptionDocument>({
  label: { type: String, required: true },
  value: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  updatedAt: { type: Date, default: Date.now },
  updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
});

export const commonOptions: SchemaOptions = {
  timestamps: true,
};

export const createBaseOptionModel = (modelName: string) => {
  return mongoose.model<BaseOptionDocument>(modelName, baseOptionSchema);
};
