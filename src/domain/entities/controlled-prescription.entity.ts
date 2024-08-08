import { ControlledPrescriptionStatus } from "../enums";
import { ControlledPrescriptionDocument } from "./../../infrastructure/db/mongo/models/controlled-prescription-model";
import { BaseEntity } from "./base.entity";

export interface ControlledPrescriptionItem {
  id: string;
  name: string;
  quantity: number;
  batchCode: string;
  expirationDate?: Date;
}

export interface ControlledPrescriptionProps {
  id?: string;
  supplier: {
    id: string;
    legalName?: string;
  };
  products: ControlledPrescriptionItem[];
  date: Date;
  number: number;
  use: "internal" | "external";
  status: ControlledPrescriptionStatus;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class ControlledPrescriptionEntity implements BaseEntity {
  id?: string;
  supplier: {
    id: string;
    legalName?: string;
  };
  products: ControlledPrescriptionItem[];
  date: Date;
  number: number;
  use: "internal" | "external";
  status: ControlledPrescriptionStatus;
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
    status,
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
    this.status = status;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  // todo
  public static fromDocument(document: ControlledPrescriptionDocument) {
    return new ControlledPrescriptionEntity({
      id: document.id,
      supplier: {
        id: document.supplier.id,
        legalName: document.supplier.legalName,
      },
      products: document.products.map((product) => ({
        id: product.id,
        name: product.name,
        quantity: product.quantity,
        batchCode: product.batchCode,
        expirationDate: product.expirationDate,
      })),
      date: document.date,
      number: document.number,
      use: document.use,
      status: document.status,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
