import { Schema } from 'mongoose';

/**
 * Reusable Address Schema
 *
 * Use this for any model that needs address fields.
 * Since Address is a Value Object with multiple fields,
 * we create a reusable schema for the embedded document.
 *
 * Usage:
 *   import { AddressSchema } from '../schemas/address.schema';
 *
 *   const MyModelSchema = new Schema({
 *     address: { type: AddressSchema, required: true },
 *     homeAddress: { type: AddressSchema, required: false }
 *   });
 *
 * Used in: CompanySettings, Employee, Customer, Supplier
 */
export const AddressSchema = new Schema(
  {
    street: {
      type: String,
      required: true,
      trim: true
    },
    exteriorNumber: {
      type: String,
      required: true,
      trim: true
    },
    interiorNumber: {
      type: String,
      trim: true
    },
    neighborhood: {
      type: String,
      required: true,
      trim: true
    },
    city: {
      type: String,
      required: true,
      trim: true
    },
    state: {
      type: String,
      required: true,
      uppercase: true // Mexican state codes: YUC, CDMX, etc.
    },
    postalCode: {
      type: String,
      required: true,
      trim: true
    },
    country: {
      type: String,
      required: true,
      trim: true
    }
  },
  {
    _id: false // Don't create sub-document ID
  }
);
