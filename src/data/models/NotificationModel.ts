import { Schema, model } from "mongoose";
import {
  INotification,
  NotificationActionType,
  NotificationReferenceType,
} from "../types/";

const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: false },
    message: { type: String, required: false },
    userId: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    referenceId: { type: String, required: true },
    referenceType: {
      type: String,
      enum: Object.values(NotificationReferenceType),
      required: true,
    },
    actionType: {
      type: String,
      enum: Object.values(NotificationActionType),
      required: true,
    },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },

  { timestamps: true }
);

const notificationModel = model<INotification>(
  "BillCreationInfo",
  notificationSchema
);

export default notificationModel;
