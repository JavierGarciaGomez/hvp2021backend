import mongoose, { Schema } from "mongoose";
import { CompanySettingsDocument } from "../../../../domain/entities/company-settings.entity";
import { AddressSchema } from "../../../../domain/value-objects";

/**
 * Address Schema for MongoDB
 */
const MongoAddressSchema = new Schema(
  AddressSchema,
  { _id: false }
);

/**
 * CompanySettings Schema
 * Singleton collection for company fiscal data
 */
const CompanySettingsSchema: Schema = new Schema<CompanySettingsDocument>(
  {
    name: { type: String, required: true },
    rfc: { type: String, required: true, length: 12 },
    employerRegistration: { type: String, required: true }, // Registro patronal IMSS
    expeditionZipCode: { type: String, required: true, length: 5 },
    federalEntityKey: { type: String, required: true, length: 3 }, // e.g., "YUC"
    fiscalAddress: { type: MongoAddressSchema, required: false },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
    collection: "company-settings",
  }
);

/**
 * Ensure singleton: only one document can exist
 */
CompanySettingsSchema.pre("save", async function (next) {
  const count = await mongoose.model("CompanySettings").countDocuments();
  if (count > 0 && this.isNew) {
    throw new Error("CompanySettings: Only one document allowed (singleton)");
  }
  next();
});

export const CompanySettingsModel = mongoose.model<CompanySettingsDocument>(
  "CompanySettings",
  CompanySettingsSchema
);
