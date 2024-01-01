import { Document, Schema, model } from "mongoose";
import { TimeOffStatus, TimeOffType } from "../constants/AttendanceConstants";

export interface TimeOffRequest extends Document {
  _id?: Schema.Types.ObjectId;
  approvalDate?: Date;
  collaborator: Schema.Types.ObjectId;
  createdAt: Date;
  createdBy: Schema.Types.ObjectId;
  reason?: string;
  requestedAt: Date;
  requestedDays: Date[];
  status: TimeOffStatus;
  timeOffType: TimeOffType;
  updatedAt: Date;
  updatedBy: Schema.Types.ObjectId;
}
