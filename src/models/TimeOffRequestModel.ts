import { Document, Schema, model } from "mongoose";
import { TimeOffStatus, TimeOffType } from "../constants/AttendanceConstants";
import { TimeOffRequest } from "../types/timeOffTypes";

const timeOffRequestSchema = new Schema<TimeOffRequest>(
  {
    approvalDate: { type: Date },
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
    collaboratorNote: { type: String },
    managerNote: { type: String },
    requestedAt: { type: Date, default: Date.now },
    requestedDays: { type: [Date], required: true },
    status: {
      type: String,
      enum: Object.values(TimeOffStatus),
      default: TimeOffStatus.pending,
    },
    timeOffType: {
      type: String,
      enum: Object.values(TimeOffType),
      required: true,
    },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
  },
  { timestamps: true }
);

const TimeOffRequestModel = model<TimeOffRequest>(
  "TimeOffRequest",
  timeOffRequestSchema
);

export default TimeOffRequestModel;
