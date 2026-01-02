import { BaseDTO } from "./base.dto";
import { CompanySettingsProps } from "../../domain/entities";
import { Address, AddressProps } from "../../domain/value-objects";

/**
 * CompanySettings DTO
 * Data Transfer Object for API layer
 */
export class CompanySettingsDTO implements BaseDTO {
  id?: string;
  name: string;
  rfc: string;
  employerRegistration: string;
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: AddressProps;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor(props: CompanySettingsProps) {
    this.id = props.id?.toString();
    this.name = props.name;
    this.rfc = props.rfc;
    this.employerRegistration = props.employerRegistration;
    this.expeditionZipCode = props.expeditionZipCode;
    this.federalEntityKey = props.federalEntityKey;

    // Convert Address VO to plain object for API response
    if (props.fiscalAddress) {
      this.fiscalAddress = props.fiscalAddress instanceof Address
        ? props.fiscalAddress.toObject()
        : props.fiscalAddress;
    }

    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy?.toString();
    this.updatedAt = props.updatedAt;
    this.updatedBy = props.updatedBy?.toString();
  }

  /**
   * Create DTO with validation
   */
  static create(data: Partial<CompanySettingsProps>): CompanySettingsDTO {
    const errors: string[] = [];

    // Validate required fields
    if (!data.name || data.name.trim().length === 0) {
      errors.push("name is required");
    }

    if (!data.rfc || data.rfc.length !== 12) {
      errors.push("rfc must be 12 characters");
    }

    if (!data.employerRegistration || data.employerRegistration.trim().length === 0) {
      errors.push("employerRegistration is required");
    }

    if (!data.expeditionZipCode || data.expeditionZipCode.length !== 5) {
      errors.push("expeditionZipCode must be 5 digits");
    }

    if (!data.federalEntityKey || data.federalEntityKey.length !== 3) {
      errors.push("federalEntityKey must be 3 characters");
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(", ")}`);
    }

    return new CompanySettingsDTO(data as CompanySettingsProps);
  }

  /**
   * Update DTO (for partial updates)
   */
  static createForUpdate(data: any): any {
    const errors: string[] = [];

    // Validate only provided fields
    if (data.rfc !== undefined && data.rfc.length !== 12) {
      errors.push("rfc must be 12 characters");
    }

    if (data.expeditionZipCode !== undefined && data.expeditionZipCode.length !== 5) {
      errors.push("expeditionZipCode must be 5 digits");
    }

    if (data.federalEntityKey !== undefined && data.federalEntityKey.length !== 3) {
      errors.push("federalEntityKey must be 3 characters");
    }

    if (errors.length > 0) {
      throw new Error(`Validation errors: ${errors.join(", ")}`);
    }

    return data;
  }
}
