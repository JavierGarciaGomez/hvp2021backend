import mongoose, { Schema, Types } from "mongoose";
import {
  NotificationActionType,
  NotificationReferenceType,
} from "../../../../domain/enums";

export interface NotificationDocument extends Document {
  id?: string;
  user: Types.ObjectId;
  title: string;
  message: string;
  referenceId: string;
  referenceType: NotificationReferenceType;
  actionType: NotificationActionType;
  read: boolean;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

const NotificationSchema: Schema = new Schema<NotificationDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Collaborator", required: true },
    title: { type: String, required: true },
    message: { type: String, required: true },
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
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const NotificationModel = mongoose.model<NotificationDocument>(
  "Notification",
  NotificationSchema
);
