import { Schema } from "mongoose";
import { AttendanceType } from "./attendanceTypes";

export interface WorkLog extends Document {
  _id?: Schema.Types.ObjectId;
  logDate?: Date;
  createdAt?: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Date;
  activities?: WorkLogActivity[];
}

export interface WorkLogActivity {
  content: string;
  relatedTask?: Schema.Types.ObjectId;
  relatedTaskActivity?: Schema.Types.ObjectId;
  createdAt?: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Schema.Types.ObjectId;
}
