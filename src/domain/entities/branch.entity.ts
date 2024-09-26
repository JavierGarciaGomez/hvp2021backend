import { BranchDocument } from "../../infrastructure/db/mongo/models/branch.model";
import { AddressVO } from "../value-objects/address.vo";
import { OpeningHoursVO } from "../value-objects/opening-hours.vo";
import { BaseEntity } from "./base.entity";

export interface BranchProps {
  id?: string;
  name: string;
  address: AddressVO;
  openingDate?: Date;
  openingHours: OpeningHoursVO[];
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class BranchEntity implements BaseEntity {
  id?: string;
  name: string;
  address: AddressVO;
  openingDate?: Date;
  openingHours: OpeningHoursVO[];
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    name,
    address,
    openingDate,
    openingHours,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: BranchProps) {
    this.id = id;
    this.name = name;
    this.address = address;
    this.openingDate = openingDate;
    this.openingHours = openingHours;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(document: BranchDocument) {
    return new BranchEntity({
      id: document.id,
      name: document.name,
      address: document.address,
      openingDate: document.openingDate,
      openingHours: document.openingHours,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
