import { BaseDTO } from "./base.dto";
import { BranchProps } from "../../domain/entities";
import { AddressVO, OpeningHoursVO } from "../../domain";

export class BranchDTO implements BaseDTO {
  name: string;
  address: AddressVO;
  openingDate?: Date;
  openingHours: OpeningHoursVO[];
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    name,
    address,
    openingDate,
    openingHours,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: BranchProps) {
    this.name = name;
    this.address = address;
    this.openingDate = openingDate;
    this.openingHours = openingHours;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: BranchProps): BranchDTO {
    const { name, address, openingHours } = data;

    const errors = [];
    if (!name) {
      errors.push("Name is required");
    }
    if (!address) {
      errors.push("Address is required");
    }

    if (!openingHours) {
      errors.push("Opening hours is required");
    }

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
