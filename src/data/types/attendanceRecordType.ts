import { Schema } from "mongoose";

export interface AttendanceRecord extends Document {
  _id?: Schema.Types.ObjectId;
  shiftDate: string;
  startTime: Date;
  endTime: Date;
  branch: Branch;
  collaborator: Schema.Types.ObjectId;
  createdAt?: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Date;
}

export enum Branch {
  Urban = "Urban",
  Harbor = "Harbor",
  Montejo = "Montejo",
}
