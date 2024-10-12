import { BaseDTO } from "./base.dto";
import { WeekShiftProps } from "../../domain/entities";
import { PaymentType } from "../../domain";
import { CollaboratorDayShift } from "../../domain/value-objects/day-shift.vo";
import {
  BaseError,
  checkForErrors,
  checkIsMonday,
  checkIsSunday,
} from "../../shared";
import { start } from "repl";
import dayjs from "dayjs";

export class WeekShiftDTO implements BaseDTO {
  startingDate: Date;
  endingDate: Date;
  shifts: CollaboratorDayShift[];
  isModel?: boolean;
  modelName?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    startingDate,
    endingDate,
    shifts,
    isModel,
    modelName,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: WeekShiftProps) {
    this.startingDate = startingDate;
    this.endingDate = endingDate;
    this.shifts = shifts;
    this.isModel = isModel;
    this.modelName = modelName;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static create(data: WeekShiftProps): WeekShiftDTO {
    const errors: string[] = [];

    const { startingDate, endingDate, shifts } = data;

    if (!startingDate) {
      errors.push("Starting date is required");
    } else {
      this.checkOldDate(startingDate, errors);
    }

    if (!endingDate) {
      errors.push("Ending date is required");
    }
    if (!shifts) {
      errors.push("Shifts are required");
    }

    if (!checkIsMonday(startingDate)) {
      errors.push("Starting date should be Monday");
    }

    if (!checkIsSunday(endingDate)) {
      errors.push("Ending date should be on Sunday");
    }

    checkForErrors(errors);

    return new WeekShiftDTO({ ...data });
  }

  static update(data: WeekShiftProps): WeekShiftDTO {
    const errors: string[] = [];
    this.checkOldDate(data.startingDate, errors);

    checkForErrors(errors);
    return new WeekShiftDTO({ ...data });
  }

  private static checkOldDate = (date: string | Date, errors: string[]) => {
    const currentDate = dayjs();

    const startingDate = date;

    // Get the current date and the first day of the current and previous month
    const startOfPreviousMonth = currentDate
      .subtract(1, "month")
      .startOf("month");

    // Check if startingDate is valid and falls within the current or previous month
    if (startingDate && dayjs(startingDate).isBefore(startOfPreviousMonth)) {
      errors.push(
        "Starting date must be within this month or the previous month."
      );
    }
  };

  private static validate(data: WeekShiftProps): WeekShiftDTO {
    return new WeekShiftDTO({ ...data });
  }
}
