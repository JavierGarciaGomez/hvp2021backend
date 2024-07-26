import { BaseDTO } from "./base.dto";
import {
  ControlledPrescriptionItem,
  ControlledPrescriptionProps,
} from "../../domain/entities";

export class ControlledPrescriptionDTO implements BaseDTO {
  id?: string;
  supplier: {
    id: string;
    legalName?: string;
  };
  products: ControlledPrescriptionItem[];
  date: Date;
  number: number;
  use: "internal" | "external";
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    supplier,
    products,
    date,
    number,
    use,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: ControlledPrescriptionProps) {
    this.id = id;
    this.supplier = supplier;
    this.products = products;
    this.date = date;
    this.number = number;
    this.use = use;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: ControlledPrescriptionProps): ControlledPrescriptionDTO {
    const { id, ...rest } = data;
    return this.validate(rest);
  }

  static update(data: ControlledPrescriptionProps): ControlledPrescriptionDTO {
    return this.validate(data);
  }

  private static validate(
    data: ControlledPrescriptionProps
  ): ControlledPrescriptionDTO {
    const errors = [];
    if (!data.supplier) {
      errors.push("Supplier is required");
    }
    if (!data.products) {
      errors.push("Products are required");
    }
    if (!data.date) {
      errors.push("Date is required");
    }
    if (!data.number) {
      errors.push("Number is required");
    }
    if (!data.use) {
      errors.push("Use is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new ControlledPrescriptionDTO({ ...data });
  }
}
