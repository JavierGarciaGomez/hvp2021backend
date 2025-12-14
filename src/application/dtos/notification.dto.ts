import { BaseDTO } from "./base.dto";
import { NotificationProps } from "../../domain/entities";
import {
  NotificationActionType,
  NotificationReferenceType,
} from "../../domain/enums";
import { checkForErrors, isValidEnum } from "../../shared/helpers";

export class NotificationDto implements BaseDTO {
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

  static create(data: NotificationProps): NotificationDto {
    return this.validate(data);
  }

  static update(data: NotificationProps): NotificationDto {
    return this.validate(data);
  }

  private static validate(data: NotificationProps): NotificationDto {
    const { user, title, message, referenceId, referenceType, actionType } =
      data;

    const errors = [];
    if (!user) errors.push("User is required");
    if (!title) errors.push("Title is required");
    if (!message) errors.push("Message is required");
    if (!referenceId) errors.push("ReferenceId is required");
    if (!referenceType) errors.push("ReferenceType is required");
    if (!actionType) errors.push("ActionType is required");

    if (actionType && !isValidEnum(NotificationActionType, actionType)) {
      errors.push("ActionType must be of type NotificationActionType");
    }

    if (
      referenceType &&
      !isValidEnum(NotificationReferenceType, referenceType)
    ) {
      errors.push("ReferenceType must be of type NotificationReferenceType");
    }

    checkForErrors(errors);

    return new NotificationDto({ ...data });
  }
}
