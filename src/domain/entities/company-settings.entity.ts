import { Document, Schema } from "mongoose";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import { Address, AddressProps } from "../value-objects";

/**
 * CompanySettings Props Interface
 * Singleton entity for company fiscal data
 */
export interface CompanySettingsProps extends newBaseEntityProps {
  name: string;
  rfc: string;
  employerRegistration: string; // Registro patronal IMSS
  expeditionZipCode: string;
  federalEntityKey: string; // e.g., "YUC" for Yucatán
  fiscalAddress?: Address | AddressProps;
}

/**
 * CompanySettings Document Interface (MongoDB)
 */
export interface CompanySettingsDocument extends Document {
  _id: Schema.Types.ObjectId;
  name: string;
  rfc: string;
  employerRegistration: string;
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: AddressProps;
  createdAt: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedAt: Date;
  updatedBy?: Schema.Types.ObjectId;
}

/**
 * CompanySettings Entity
 * Singleton aggregate root for company fiscal information
 * Used for CFDI payroll generation
 */
export class CompanySettingsEntity implements BaseEntity {
  id?: string;
  name: string;
  rfc: string;
  employerRegistration: string;
  expeditionZipCode: string;
  federalEntityKey: string;
  fiscalAddress?: Address;
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

    // Convert plain object to Address VO if needed
    if (props.fiscalAddress) {
      this.fiscalAddress = props.fiscalAddress instanceof Address
        ? props.fiscalAddress
        : new Address(props.fiscalAddress);
    }

    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy?.toString();
    this.updatedAt = props.updatedAt;
    this.updatedBy = props.updatedBy?.toString();

    this.validate();
  }

  /**
   * Validate business invariants
   */
  private validate(): void {
    if (!this.name || this.name.trim().length === 0) {
      throw new Error("CompanySettings: name is required");
    }

    if (!this.rfc || this.rfc.length !== 12) {
      throw new Error("CompanySettings: RFC must be 12 characters");
    }

    if (!this.employerRegistration || this.employerRegistration.trim().length === 0) {
      throw new Error("CompanySettings: employer registration is required");
    }

    if (!this.expeditionZipCode || this.expeditionZipCode.length !== 5) {
      throw new Error("CompanySettings: expedition zip code must be 5 digits");
    }

    if (!this.federalEntityKey || this.federalEntityKey.length !== 3) {
      throw new Error("CompanySettings: federal entity key must be 3 characters");
    }
  }

  /**
   * Create entity from MongoDB document
   */
  public static fromDocument(document: CompanySettingsDocument): CompanySettingsEntity {
    const data = document.toObject<CompanySettingsDocument>();
    const { _id, __v, ...rest } = data;

    return new CompanySettingsEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
    });
  }
}

export interface CompanySettingsResponse extends CompanySettingsEntity {}
