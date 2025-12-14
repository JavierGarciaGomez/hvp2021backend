import { BaseDTO } from "./base.dto";
import { AttendanceRecordProps } from "../../domain/entities/attendance-record.entity";
import { BaseError, checkForErrors } from "../../shared";
import dayjs from "dayjs";

interface ExtendedProps extends AttendanceRecordProps {
  action?: "clock_in" | "clock_out";
}
export class AttendanceRecordDTO implements BaseDTO {
  shiftDate!: Date;
  startTime!: Date;
  endTime?: Date;
  clockInBranch!: string;
  clockOutBranch?: string;
  collaborator!: string;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  action?: "clock_in" | "clock_out";

  constructor(props: ExtendedProps) {
    this.shiftDate = props.shiftDate;
    this.startTime = props.startTime;
    this.endTime = props.endTime;
    this.clockInBranch = props.clockInBranch;
    this.clockOutBranch = props.clockOutBranch;
    this.collaborator = props.collaborator;
    this.startLatitude = props.startLatitude;
    this.startLongitude = props.startLongitude;
    this.endLatitude = props.endLatitude;
    this.endLongitude = props.endLongitude;
    this.createdAt = props.createdAt;
    this.createdBy = props.createdBy;
    this.updatedAt = props.updatedAt;
    this.updatedBy = props.updatedBy;
    this.action = props.action;
  }

  static create(data: ExtendedProps): AttendanceRecordDTO {
    const errors: string[] = [];

    const {
      shiftDate,
      startTime,
      endTime,
      clockInBranch,
      collaborator,
      action,
    } = data;

    if (!shiftDate) errors.push("Shift date is required");
    if (action && action === "clock_in") {
      data.startTime = new Date();
    }
    if (action && action === "clock_out" && !endTime) {
      data.endTime = new Date();
    }

    if (action && action === "clock_out" && !endTime)
      errors.push("End time is required");

    if (!clockInBranch) errors.push("Clock-in branch is required");
    if (!collaborator) errors.push("Collaborator is required");

    if (shiftDate) this.checkOldDate(shiftDate, errors);
    if (startTime && endTime && dayjs(startTime).isAfter(dayjs(endTime))) {
      errors.push("Start time must be before end time");
    }

    checkForErrors(errors);

    return new AttendanceRecordDTO(data);
  }

  static update(data: Partial<ExtendedProps>): AttendanceRecordDTO {
    const errors: string[] = [];

    if (data.action && data.action === "clock_out" && !data.endTime) {
      data.endTime = new Date();
    }

    if (data.shiftDate) this.checkOldDate(data.shiftDate, errors);
    if (
      data.startTime &&
      data.endTime &&
      dayjs(data.startTime).isAfter(dayjs(data.endTime))
    ) {
      errors.push("Start time must be before end time");
    }

    checkForErrors(errors);

    return new AttendanceRecordDTO(data as AttendanceRecordProps);
  }

  private static checkOldDate(date: Date, errors: string[]) {
    const startOfPreviousMonth = dayjs().subtract(1, "month").startOf("month");
    if (dayjs(date).isBefore(startOfPreviousMonth)) {
      errors.push(
        "Shift date must be within this month or the previous month."
      );
    }
  }
}
