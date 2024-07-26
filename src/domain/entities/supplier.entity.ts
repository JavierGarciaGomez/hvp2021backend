import { SupplierDocument } from "../../infrastructure";
import { BaseEntity } from "./base.entity";

export interface SupplierProps {
  id?: string;
  name: string;
  legalName?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class SupplierEntity implements BaseEntity {
  id?: string;
  name: string;
  legalName?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    name,
    legalName: legal_name,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: SupplierProps) {
    this.id = id;
    this.name = name;
    this.legalName = legal_name;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(document: SupplierDocument) {
    return new SupplierEntity({
      id: document.id,
      name: document.name,
      legalName: document.legalName,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
