import { ProductDocument } from "../../infrastructure";
import { BaseEntity } from "./base.entity";

export interface ProductProps {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class ProductEntity implements BaseEntity {
  id?: string;
  name: string;
  description: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    name,
    description,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: ProductProps) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(document: ProductDocument) {
    return new ProductEntity({
      id: document.id,
      name: document.name,
      description: document.description,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
