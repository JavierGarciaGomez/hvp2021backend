import { Schema } from "mongoose";
import { AttendanceType } from "./attendanceTypes";

export enum TimeOffType {
  partialPermission = AttendanceType.partialPermission,
  simulatedAbsence = AttendanceType.simulatedAbsence,
  vacation = AttendanceType.vacation,
  sickLeaveIMSSUnpaid = AttendanceType.sickLeaveIMSSUnpaid,
  sickLeaveIMSSPaid = AttendanceType.sickLeaveIMSSPaid,
  sickLeaveJustifiedByCompany = AttendanceType.sickLeaveJustifiedByCompany,
  dayLeave = AttendanceType.dayLeave,
}

export enum TimeOffStatus {
  pending = "Pending",
  approved = "Approved",
  rejected = "Rejected",
}

export interface TimeOffRequest extends Document {
  _id?: Schema.Types.ObjectId;
  approvalDate?: Date;
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
