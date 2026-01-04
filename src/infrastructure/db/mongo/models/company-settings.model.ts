import mongoose, { Schema, Document, Types } from 'mongoose';
import { AddressSchema } from '../schemas/address.schema';
import {
  RFCFieldDefinition,
  BusinessNameFieldDefinition,
  TaxRegimeFieldDefinition,
  EmailFieldDefinition,
  PhoneFieldDefinition,
  CreatedByFieldDefinition,
  UpdatedByFieldDefinition
} from '../schemas/common-fields';

/**
 * MongoDB Document Interface
 *
 * LEARNING POINTS:
 * 1. This extends Mongoose Document - it's infrastructure code
 * 2. Structure mirrors database, not domain
 * 3. All fields are primitives (no Value Objects)
 * 4. No business logic here - just persistence structure
 */
export interface ICompanySettingsDocument extends Document {
  _id: string;
  rfc: string;
  businessName: string;
  taxRegime: string;
  address: {
    street: string;
    exteriorNumber: string;
    interiorNumber?: string;
    neighborhood: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  email: string;
  phone?: string;
  facturamaApiKey?: string;
  facturamaApiSecret?: string;
  facturamaUseSandbox: boolean;
  createdAt: Date;
  createdBy: Types.ObjectId;
  updatedAt: Date;
  updatedBy: Types.ObjectId;
}

/**
 * Mongoose Schema Definition
 *
 * Uses reusable schemas and field definitions for consistency.
 */
const CompanySettingsSchema = new Schema<ICompanySettingsDocument>(
  {
    _id: {
      type: String,
      default: 'company-settings',
      required: true
    },

    // Tax Information - using reusable field definitions
    rfc: RFCFieldDefinition,
    businessName: BusinessNameFieldDefinition,
    taxRegime: TaxRegimeFieldDefinition,

    // Address - using reusable schema
    address: {
      type: AddressSchema,
      required: true
    },

    // Contact - using reusable field definitions
    email: EmailFieldDefinition,
    phone: PhoneFieldDefinition,

    // Facturama Integration
    facturamaApiKey: {
      type: String,
      trim: true
    },
    facturamaApiSecret: {
      type: String,
      trim: true
    },
    facturamaUseSandbox: {
      type: Boolean,
      required: true,
      default: true
    },

    // Audit fields
    createdBy: CreatedByFieldDefinition,
    updatedBy: UpdatedByFieldDefinition
  },
  {
    timestamps: true,
    collection: 'company_settings'
  }
);

CompanySettingsSchema.index({ _id: 1 });

export const CompanySettingsModel = mongoose.model<ICompanySettingsDocument>(
  'CompanySettings',
  CompanySettingsSchema
);
