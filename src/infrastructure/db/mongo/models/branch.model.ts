import mongoose, { Schema } from "mongoose";
import {
  BranchDocument,
  BranchProps,
} from "../../../../domain/entities/branch.entity";
import { AddressSchema, GeoLocationSchema } from "../../../../domain";

const BranchSchema: Schema = new Schema<BranchDocument>(
  {
    name: { type: String, required: true },
    address: AddressSchema,
    openingDate: { type: Date, required: false },
    openingHours: [
      {
        day: { type: String, required: true },
        open: { type: String, required: false },
        close: { type: String, required: false },
      },
    ],
    phoneNumber: { type: String, required: true },
    whatsappNumber: { type: String, required: true },
    geoLocation: GeoLocationSchema,
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const BranchModel = mongoose.model<BranchDocument>(
  "Branch",
  BranchSchema
);
