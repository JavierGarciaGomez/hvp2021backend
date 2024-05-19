import { Schema } from "mongoose";

export interface AttendanceRecord extends Document {
  _id?: Schema.Types.ObjectId;
  shiftDate: string;
  startTime: Date;
  endTime: Date;
  clockInBranch: Branch;
  clockOutBranch?: Branch;
  collaborator: Schema.Types.ObjectId;
  createdAt?: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Date;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
}

export enum Branch {
  Urban = "Urban",
  Harbor = "Harbor",
  Montejo = "Montejo",
}
