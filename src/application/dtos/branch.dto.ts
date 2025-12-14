import { BaseDTO } from "./base.dto";
import { BranchProps } from "../../domain/entities";
import { AddressVO, GeoLocationVO, OpeningHoursVO } from "../../domain";
import { validateRequiredFields } from "../../shared";

export class BranchDTO implements BaseDTO {
  name: string;
  address: AddressVO;
  openingDate?: Date;
  openingHours: OpeningHoursVO[];
  phoneNumber: string;
  whatsappNumber: string;
  geoLocation: GeoLocationVO;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    name,
    address,
    openingDate,
    openingHours,
    phoneNumber,
    whatsappNumber,
    geoLocation,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: BranchProps) {
    this.name = name;
    this.address = address;
    this.openingDate = openingDate;
    this.openingHours = openingHours;
    this.phoneNumber = phoneNumber;
    this.whatsappNumber = whatsappNumber;
    this.geoLocation = geoLocation;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: BranchProps): BranchDTO {
    const {} = data;

    const errors: string[] = [];

    validateRequiredFields(data, [
      "name",
      "address",
      "openingHours",
      "phoneNumber",
      "whatsappNumber",
      "geoLocation",
    ]);

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new BranchDTO({ ...data });
  }

  static update(data: BranchProps): BranchDTO {
    return this.validate(data);
  }

  private static validate(data: BranchProps): BranchDTO {
    return new BranchDTO({ ...data });
  }
}
