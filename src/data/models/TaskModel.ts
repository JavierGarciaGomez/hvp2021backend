import { Schema, model } from "mongoose";
import {
  TimeOffRequest,
  TimeOffStatus,
  TimeOffType,
} from "../types/timeOffTypes";
import { Task, TaskPriority, TaskStatus, TaskTag } from "../types/taskTypes";

const taskSchema = new Schema<Task>(
  {
    activities: [{ type: Schema.Types.ObjectId, ref: "TaskActivity" }],
    assignees: [{ type: Schema.Types.ObjectId, ref: "Collaborator" }],
    author: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    completedAt: { type: Date },
    completionCriteria: [{ type: String }],

    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    description: { type: String },
    dueDate: { type: Date },
    notes: { type: String },
    number: { type: Number },
    priority: {
      type: String,
      enum: Object.values(TaskPriority),
      default: TaskPriority.Low,
    },
    requestedAt: { type: Date, default: Date.now },
    status: {
      type: String,
      enum: Object.values(TaskStatus),
      default: TaskStatus.Backlog,
    },
    tags: [{ type: String, enum: Object.values(TaskTag) }],
    title: { type: String, required: true },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  { timestamps: true }
);

// Pre-save middleware to assign consecutive number
taskSchema.pre<Task>("save", async function (next) {
  const currentTask = this;
  if (!currentTask.number) {
    try {
      const lastTask = await TaskModel.findOne(
        {},
        {},
        { sort: { number: -1 } }
      );
      currentTask.number = (lastTask?.number || 0) + 1;
    } catch (error: any) {
      next(error);
    }
  }
  next();
});

const TaskModel = model<Task>("Task", taskSchema);

export default TaskModel;
