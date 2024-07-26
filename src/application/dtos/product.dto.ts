import { BaseDTO } from "./base.dto";
import { ProductProps } from "../../domain/entities";

export class ProductDTO implements BaseDTO {
  name: string;
  description: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    name,
    description,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: ProductProps) {
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: ProductProps): ProductDTO {
    return this.validate(data);
  }

  static update(data: ProductProps): ProductDTO {
    return this.validate(data);
  }

  private static validate(data: ProductProps): ProductDTO {
    const { name, description } = data;

    const errors = [];
    if (!name) {
      errors.push("Name is required");
    }
    if (!description) {
      errors.push("Description is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new ProductDTO({ ...data });
  }
}
