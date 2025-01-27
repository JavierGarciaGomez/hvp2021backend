import { Schema, model } from "mongoose";

import {
  TimeOffRequestDocument,
  TimeOffStatus,
  TimeOffType,
} from "../../../../domain";

const timeOffRequestSchema = new Schema<TimeOffRequestDocument>(
  {
    approvedAt: { type: Date },
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
      required: false,
    },
    collaborator: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
      required: true,
    },
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
      default: TimeOffStatus.Pending,
    },
    timeOffType: {
      type: String,
      enum: Object.values(TimeOffType),
      required: true,
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
    },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

const TimeOffRequestModel = model<TimeOffRequestDocument>(
  "TimeOffRequest",
  timeOffRequestSchema
);

export default TimeOffRequestModel;
