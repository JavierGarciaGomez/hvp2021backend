import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface PublicHolidaysProps extends BaseEntityProps {
  year: number;
  publicHolidays: Date[];
}

export interface PublicHolidaysDocument extends PublicHolidaysProps, Document {}

export class PublicHolidaysEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  year: number;
  publicHolidays: Date[];

  constructor({
    id,
    year,
    publicHolidays,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: PublicHolidaysProps) {
    this.id = id;
    this.year = year;
    this.publicHolidays = publicHolidays;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(document: PublicHolidaysDocument) {
    return new PublicHolidaysEntity({
      id: document.id,
      year: document.year,
      publicHolidays: document.publicHolidays,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
