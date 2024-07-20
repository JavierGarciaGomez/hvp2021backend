import { NotificationDocument } from "../../infrastructure/db/mongo/models/notification.model";
import { NotificationActionType, NotificationReferenceType } from "../enums";
import { BaseEntity } from "./base.entity";

export interface NotificationProps {
  id?: string;
  user: string;
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

export class NotificationEntity implements BaseEntity {
  id?: string;
  user: string;
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

  constructor({
    id,
    user,
    title,
    message,
    referenceId,
    referenceType,
    actionType,
    read,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: NotificationProps) {
    this.id = id;
    this.user = user;
    this.title = title;
    this.message = message;
    this.referenceId = referenceId;
    this.referenceType = referenceType;
    this.actionType = actionType;
    this.read = read;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(
    document: NotificationDocument
  ): NotificationEntity {
    return new NotificationEntity({
      id: document.id,
      user: document.user.toString(),
      title: document.title,
      message: document.message,
      referenceId: document.referenceId,
      referenceType: document.referenceType,
      read: document.read,
      actionType: document.actionType,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
