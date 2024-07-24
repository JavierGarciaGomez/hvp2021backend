import { Schema, model } from "mongoose";
import {
  TimeOffRequest,
  TimeOffStatus,
  TimeOffType,
} from "../types/timeOffTypes";
import { Task, TaskActivity } from "../types/taskTypes";

const TaskActivitySchema = new Schema<TaskActivity>(
  {
    author: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    registeredAt: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const TaskActivityModel = model<TaskActivity>(
  "TaskActivity",
  TaskActivitySchema
);

export default TaskActivityModel;
