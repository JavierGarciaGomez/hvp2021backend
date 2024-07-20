import { ObjectId } from "mongodb";
import {
  isValidDate,
  isValidDateString,
} from "../../../shared/helpers/dateHelpers";

interface Options {
  _id?: string;
  shiftDate: string;
  startTime: string;
  endTime: string;
  branch: string;
  collaborator: string;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
  action?: "clock_in" | "clock_out";
}
export class AttendanceRecordDto {
  private constructor(public readonly data: Readonly<Options>) {}

  static create(data: Options): [string?, AttendanceRecordDto?] {
    return this.createOrUpdate(data);
  }

  static update(data: Options): [string?, AttendanceRecordDto?] {
    return this.createOrUpdate(data);
  }

  private static createOrUpdate(
    data: Options
  ): [string?, AttendanceRecordDto?] {
    const validationError = this.validateOptions(data);
    if (validationError) return [validationError];
    const { action } = data;
    if (action && action === "clock_in") {
      data.startTime = new Date().toISOString();
    }
    if (action && action === "clock_out") {
      data.endTime = new Date().toISOString();
    }

    return [undefined, new AttendanceRecordDto({ ...data })];
  }

  private static validateOptions(data: Options): string | undefined {
    const { collaborator, shiftDate, startTime, endTime, branch } = data;
    if (!ObjectId.isValid(collaborator)) {
      return "Collaborator id is not valid";
    }
    if (!isValidDateString(shiftDate)) {
      return "Shift date is not valid";
    }

    if (data) return undefined;
  }
}
