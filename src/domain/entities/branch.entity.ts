import { GeoLocationVO } from "../value-objects";
import { AddressVO } from "../value-objects/address.vo";
import { OpeningHoursVO } from "../value-objects/opening-hours.vo";
import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface BranchProps extends BaseEntityProps {
  name: string;
  address: AddressVO;
  openingDate?: Date;
  openingHours: OpeningHoursVO[];
  phoneNumber: string;
  whatsappNumber: string;
  geoLocation: GeoLocationVO;
}

export interface BranchDocument extends BranchProps, Document {}

export class BranchEntity implements BaseEntity {
  id?: string;
  name: string;
  address: AddressVO;
  openingDate?: Date;
  openingHours: OpeningHoursVO[];
  phoneNumber: string;
  whatsappNumber: string;
  geoLocation: GeoLocationVO;
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
    phoneNumber,
    whatsappNumber,
    geoLocation,
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
    this.phoneNumber = phoneNumber;
    this.whatsappNumber = whatsappNumber;
    this.geoLocation = geoLocation;
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
      phoneNumber: document.phoneNumber,
      whatsappNumber: document.whatsappNumber,
      geoLocation: document.geoLocation,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
