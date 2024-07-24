import { Schema, model } from "mongoose";
import { WorkLog } from "../../../../shared";

const workLogSchema = new Schema<WorkLog>(
  {
    activities: [
      {
        content: String,
        relatedTask: { type: Schema.Types.ObjectId, ref: "Task" },
        relatedTaskActivity: {
          type: Schema.Types.ObjectId,
          ref: "TaskActivity",
        },
        createdAt: { type: Date, default: Date.now },
        createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
        updatedAt: { type: Date, default: Date.now },
        updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
      },
    ],
    logDate: { type: Date, default: Date.now },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  { timestamps: true }
);

const WorkLogModel = model<WorkLog>("WorkLog", workLogSchema);

export default WorkLogModel;
