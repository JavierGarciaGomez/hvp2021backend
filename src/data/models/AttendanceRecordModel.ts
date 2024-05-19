import { Schema, model } from "mongoose";
import {
  TimeOffRequest,
  TimeOffStatus,
  TimeOffType,
} from "../types/timeOffTypes";
import { Task, TaskPriority, TaskStatus, TaskTag } from "../types/taskTypes";
import { Branch, AttendanceRecord } from "../types/attendanceRecordType";

const attendanceRecordSchema = new Schema<AttendanceRecord>(
  {
    collaborator: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    shiftDate: {
      type: String,
      required: true,
      validate: {
        validator: function (value: string) {
          return /\d{4}-\d{2}-\d{2}/.test(value);
        },
        message: (props: any) => `${props.value} is not a valid date format`,
      },
    },
    startTime: { type: Date, default: Date.now },
    endTime: { type: Date, required: false },
    clockInBranch: {
      type: String,
      enum: Object.values(Branch),
      required: true,
    },
    clockOutBranch: {
      type: String,
      enum: Object.values(Branch),
      required: false,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  { timestamps: true }
);

const AttendanceRecordModel = model<AttendanceRecord>(
  "TimeShift",
  attendanceRecordSchema
);

export default AttendanceRecordModel;
