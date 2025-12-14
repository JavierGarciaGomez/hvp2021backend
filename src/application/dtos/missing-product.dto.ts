import { BaseDTO } from "./base.dto";
import { MissingProductProps, ProductProps } from "../../domain/entities";
import { checkForErrors } from "../../shared";

export class MissingProductDTO implements BaseDTO {
  id?: string;
  date: Date;
  missingProduct: string;
  description: string;
  collaborator: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    date,
    missingProduct,
    description,
    collaborator,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: MissingProductProps) {
    this.id = id;
    this.date = date;
    this.missingProduct = missingProduct;
    this.description = description;
    this.collaborator = collaborator;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: MissingProductProps): MissingProductDTO {
    const errors: string[] = [];
    const { date, missingProduct, collaborator, description } = data;
    if (!date) {
      errors.push("Date is required");
    }
    if (!missingProduct) {
      errors.push("Missing product is required");
    }
    if (!collaborator) {
      errors.push("Collaborator is required");
    }
    if (!description) {
      errors.push("Description is required");
    }
    checkForErrors(errors);
    return this.validate(data);
  }

  static update(data: MissingProductProps): MissingProductDTO {
    return this.validate(data);
  }

  private static validate(data: MissingProductProps): MissingProductDTO {
    return new MissingProductDTO({ ...data });
  }
}
