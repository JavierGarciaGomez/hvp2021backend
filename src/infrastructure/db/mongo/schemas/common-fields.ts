import { Schema } from 'mongoose';

/**
 * Reusable Field Definitions
 *
 * For simple Value Objects that map to a single primitive field,
 * we create reusable field definitions instead of schemas.
 *
 * These ensure consistency across all models that use these fields.
 *
 * Usage:
 *   import { RFCFieldDefinition, EmailFieldDefinition } from '../schemas/common-fields';
 *
 *   const MyModelSchema = new Schema({
 *     rfc: RFCFieldDefinition,
 *     email: EmailFieldDefinition
 *   });
 */

/**
 * RFC Field Definition
 * Mexican tax identification number (12-13 characters)
 * Used in: CompanySettings, Employee, Customer, Supplier
 */
export const RFCFieldDefinition = {
  type: String,
  required: true,
  uppercase: true,
  trim: true
};

/**
 * Optional RFC Field Definition
 * Use when RFC is not mandatory
 */
export const OptionalRFCFieldDefinition = {
  type: String,
  uppercase: true,
  trim: true
};

/**
 * Email Field Definition
 * Used in: CompanySettings, Employee, Customer, Supplier, Contact
 */
export const EmailFieldDefinition = {
  type: String,
  required: true,
  lowercase: true,
  trim: true
};

/**
 * Optional Email Field Definition
 * Use when email is not mandatory
 */
export const OptionalEmailFieldDefinition = {
  type: String,
  lowercase: true,
  trim: true
};

/**
 * Phone Field Definition (optional by default)
 * 10-digit Mexican phone number
 * Used in: CompanySettings, Employee, Customer, Supplier, Contact
 */
export const PhoneFieldDefinition = {
  type: String,
  trim: true
};

/**
 * Required Phone Field Definition
 * Use when phone is mandatory
 */
export const RequiredPhoneFieldDefinition = {
  type: String,
  required: true,
  trim: true
};

/**
 * Business Name Field Definition
 * Company or business legal name
 */
export const BusinessNameFieldDefinition = {
  type: String,
  required: true,
  trim: true
};

/**
 * Tax Regime Field Definition
 * Mexican tax regime (régimen fiscal)
 */
export const TaxRegimeFieldDefinition = {
  type: String,
  required: true,
  trim: true
};

// ============================================================================
// Audit Fields
// ============================================================================

/**
 * CreatedBy Field Definition
 * Reference to the user who created the record
 * Used in: All entities that need audit trail
 */
export const CreatedByFieldDefinition = {
  type: Schema.Types.ObjectId,
  ref: 'Collaborator',
  required: true
};

/**
 * UpdatedBy Field Definition
 * Reference to the user who last updated the record
 * Used in: All entities that need audit trail
 */
export const UpdatedByFieldDefinition = {
  type: Schema.Types.ObjectId,
  ref: 'Collaborator',
  required: true
};
