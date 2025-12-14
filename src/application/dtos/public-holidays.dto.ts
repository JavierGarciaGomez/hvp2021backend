import { BaseDTO } from "./base.dto";
import { PublicHolidaysProps } from "../../domain/entities";
import { AddressVO, OpeningHoursVO } from "../../domain";

export class PublicHolidaysDTO implements BaseDTO {
  publicHolidays: Date[];
  year: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    year,
    publicHolidays,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: PublicHolidaysProps) {
    this.year = year;
    this.publicHolidays = publicHolidays;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: PublicHolidaysProps): PublicHolidaysDTO {
    const errors = [];
    const { year, publicHolidays } = data;

    if (!year) {
      errors.push("Year is required");
    }

    if (!publicHolidays || publicHolidays.length === 0) {
      errors.push("Public holidays is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new PublicHolidaysDTO({ ...data });
  }

  static update(data: PublicHolidaysProps): PublicHolidaysDTO {
    return this.validate(data);
  }

  private static validate(data: PublicHolidaysProps): PublicHolidaysDTO {
    return new PublicHolidaysDTO({ ...data });
  }
}
