import mongoose, { Schema } from "mongoose";
import { AttendanceRecordDocument } from "../../../../domain/entities/attendance-record.entity";

export const AttendanceRecordSchema: Schema =
  new Schema<AttendanceRecordDocument>(
    {
      shiftDate: { type: Date, required: true },
      startTime: { type: Date, required: true },
      endTime: { type: Date },
      clockInBranch: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
      },
      clockOutBranch: { type: Schema.Types.ObjectId, ref: "Branch" },
      collaborator: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
        required: true,
      },
      startLatitude: { type: Number },
      startLongitude: { type: Number },
      endLatitude: { type: Number },
      endLongitude: { type: Number },
      createdAt: { type: Date, default: Date.now },
      createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
      updatedAt: { type: Date, default: Date.now },
      updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    },
    {
      timestamps: true,
    }
  );

export const AttendanceRecordModel = mongoose.model<AttendanceRecordDocument>(
  "TimeShift",
  AttendanceRecordSchema
);
