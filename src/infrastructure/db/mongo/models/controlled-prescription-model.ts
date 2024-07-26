import mongoose, { Schema } from "mongoose";
import { ControlledPrescriptionProps } from "../../../../domain";

export interface ControlledPrescriptionDocument
  extends ControlledPrescriptionProps,
    Document {}

const ControlledPrescriptionSchema: Schema =
  new Schema<ControlledPrescriptionDocument>(
    {
      supplier: {
        id: { type: Schema.Types.ObjectId, ref: "Supplier", required: true },
        legalName: { type: String, required: true },
      },
      products: [
        {
          id: { type: String, required: true },
          name: { type: String, required: true },
          quantity: { type: Number, required: true },
          batchCode: { type: String, required: true },
          expirationDate: { type: Date, required: false },
        },
      ],
      date: { type: Date, required: true },
      number: { type: Number, required: true },
      use: { type: String, enum: ["internal", "external"], required: true },
      createdAt: { type: Date, default: Date.now },
      createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    },
    {
      timestamps: true,
    }
  );

export const ControlledPrescriptionModel =
  mongoose.model<ControlledPrescriptionDocument>(
    "ControlledPrescription",
    ControlledPrescriptionSchema
  );
