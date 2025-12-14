// todo: DELETE THIS

import { Schema } from "mongoose";
import { AttendanceType } from "./attendanceTypes";

export enum TimeOffType {
  partialPermission = AttendanceType.partialPermission,
  simulatedAbsence = AttendanceType.simulatedAbsence,
  Vacation = AttendanceType.vacation,
  sickLeaveIMSSUnpaid = AttendanceType.sickLeaveIMSSUnpaid,
  sickLeaveIMSSPaid = AttendanceType.sickLeaveIMSSPaid,
  sickLeaveJustifiedByCompany = AttendanceType.sickLeaveJustifiedByCompany,
  dayLeave = AttendanceType.dayLeave,
}

export enum TimeOffStatus {
  Pending = "Pending",
  Approved = "Approved",
  Rejected = "Rejected",
  Canceled = "Canceled",
}

export interface TimeOffRequest extends Document {
  _id?: Schema.Types.ObjectId;
  approvedAt?: Date;
  approvedBy?: Schema.Types.ObjectId;
  collaborator: Schema.Types.ObjectId;
  createdAt: Date;
  createdBy: Schema.Types.ObjectId;
  collaboratorNote?: string;
  managerNote?: string;
  requestedAt: Date;
  requestedDays: Date[];
  status: TimeOffStatus;
  timeOffType: TimeOffType;
  updatedAt: Date;
  updatedBy: Schema.Types.ObjectId;
}

type ModifiedTimeOffRequest<T> = {
  [K in keyof TimeOffRequest]: K extends keyof T ? T[K] : TimeOffRequest[K];
};

export interface CollaboratorTimeOffOverview {
  collaboratorId: string;
  totalVacationDays: number; // a) The number of vacation days the collaborator has a right to take
  vacationsTaken: Date[]; // b) Vacations taken by the collaborator (an array of dates)
  vacationsRequested: Date[]; // c) Vacations requested but not approved (an array of dates)
  remainingVacationDays: number; // d) Number of vacation days left for the collaborator
  dateTimeOffRequests: DateTimeOffRequest[];
  lastAnniversaryDate: Date; // e) The last anniversary date of the collaborator
  legalVacationDays: number; // f) The number of legal vacation days the collaborator has a right to take
  remainingLegalVacationDays: number;
  remainingcurrentYearVacationDays: number;
}

export interface DateTimeOffRequest {
  date: Date;
  id: string;
  timeOffType: TimeOffType;
  status: TimeOffStatus;
  collaborator: Schema.Types.ObjectId;
}
