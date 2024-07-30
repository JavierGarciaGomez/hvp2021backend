import { BaseDTO } from "./base.dto";
import { SupplierProps } from "../../domain/entities";
import { checkForErrors } from "../../shared";

export class SupplierDTO implements BaseDTO {
  name: string;
  legalName?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    name,
    legalName,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: SupplierProps) {
    this.name = name;
    this.legalName = legalName;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: SupplierProps): SupplierDTO {
    const { name } = data;

    const errors = [];
    if (!name) {
      errors.push("Name is required");
    }

    checkForErrors(errors);
    return this.validate(data);
  }

  static update(data: SupplierProps): SupplierDTO {
    return this.validate(data);
  }

  private static validate(data: SupplierProps): SupplierDTO {
    return new SupplierDTO({ ...data });
  }
}
