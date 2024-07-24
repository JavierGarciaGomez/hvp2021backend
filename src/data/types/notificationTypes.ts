import { Document, Schema } from "mongoose";

export interface INotification extends Document {
  _id?: string;
  userId: Schema.Types.ObjectId;
  title: string;
  message: string;
  referenceId: string;
  referenceType: NotificationReferenceType;
  actionType: NotificationActionType;
  createdAt?: string;
  createdBy?: string;
  updatedAt?: string;
  updatedBy?: string;
}

export enum NotificationReferenceType {
  TASK = "TASK",
  BILL_CREATION_INFO = "BILL_CREATION_INFO",
  AUTH_ACTIVITY = "AUTH_ACTIVITY",
  TIME_OFF_REQUEST = "TIME_OFF_REQUEST",
  USER = "USER",
}

//
export enum NotificationActionType {
  ASSIGNED = "ASSIGNED",
  UNASSIGNED = "UNASSIGNED",
  STATUS_CHANGED = "STATUS_CHANGED",
  COMPLETED = "COMPLETED",
  CANCELED = "CANCELED",
  AWAITING_APPROVAL = "AWAITING_APPROVAL",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
  AWAITING_REVIEW = "AWAITING_REVIEW",
}
