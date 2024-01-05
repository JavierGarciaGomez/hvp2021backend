import { Document, Schema, model } from "mongoose";
import { TimeOffStatus, TimeOffType } from "../constants/AttendanceConstants";

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

export interface CollaboratorImeOffOverview {
  collaboratorId: string;
  totalVacationDays: number; // a) The number of vacation days the collaborator has a right to take
  vacationsTaken: Date[]; // b) Vacations taken by the collaborator (an array of dates)
  vacationsRequested: Date[]; // c) Vacations requested but not approved (an array of dates)
  remainingVacationDays: number; // d) Number of vacation days left for the collaborator
  partialPermissions: Date[];
  simulatedAbsences: Date[];
  sickLeavesIMSSUnpaid: Date[];
  sickLeavesIMSSPaid: Date[];
  sickLeavesJustifiedByCompany: Date[];
  dayLeaves: Date[];
}
