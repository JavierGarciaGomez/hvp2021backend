import { BaseDTO } from "./base.dto";
import { WeekShiftProps } from "../../domain/entities";
import { PaymentType } from "../../domain";
import { CollaboratorDayShift } from "../../domain/value-objects/day-shift.vo";

export class WeekShiftDTO implements BaseDTO {
  startingDate: string;
  endingDate: string;
  shifts: CollaboratorDayShift[];
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    startingDate,
    endingDate,
    shifts,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: WeekShiftProps) {
    this.startingDate = startingDate;
    this.endingDate = endingDate;
    this.shifts = shifts;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: WeekShiftProps): WeekShiftDTO {
    const errors = [];

    const { startingDate, endingDate, shifts } = data;

    if (!startingDate) {
      errors.push("Starting date is required");
    }
    if (!endingDate) {
      errors.push("Ending date is required");
    }
    if (!shifts || shifts.length === 0) {
      errors.push("Shifts are required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new WeekShiftDTO({ ...data });
  }

  static update(data: WeekShiftProps): WeekShiftDTO {
    return this.validate(data);
  }

  private static validate(data: WeekShiftProps): WeekShiftDTO {
    return new WeekShiftDTO({ ...data });
  }
}
