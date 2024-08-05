import { MissingProductDocument } from "../../infrastructure";
import { BaseEntity } from "./base.entity";

export interface MissingProductProps {
  id?: string;
  date: Date;
  missingProduct: string;
  description: string;
  collaborator: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class MissingProductEntity implements BaseEntity {
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

  public static fromDocument(document: MissingProductDocument) {
    return new MissingProductEntity({
      id: document.id,
      date: document.date,
      missingProduct: document.missingProduct,
      description: document.description,
      collaborator: document.collaborator.toString(),
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
