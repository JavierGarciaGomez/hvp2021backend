import mongoose, { ObjectId, Schema } from "mongoose";
import { ActivityRegisterEntity } from "../../../../domain";

export interface ActivityRegisterDocument
  extends Omit<ActivityRegisterEntity, "collaborator">,
    Document {
  collaborator: ObjectId;
}

const ActivityRegisterSchema: Schema = new Schema<ActivityRegisterDocument>(
  {
    collaborator: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    activity: { type: String, required: true },
    desc: { type: String },
    startingTime: { type: Date, required: true },
    endingTime: { type: Date },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const ActivityRegisterModel = mongoose.model<ActivityRegisterDocument>(
  "ActivityRegister",
  ActivityRegisterSchema
);
