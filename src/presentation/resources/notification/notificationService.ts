import {
  INotification,
  NotificationActionType,
  NotificationReferenceType,
} from "./../../../data/types/notificationTypes";
import notificationModel from "../../../data/models/NotificationModel";
import { BaseError } from "../../../domain/errors/BaseError";
import { handleUnknownError } from "../../../helpers";

export class NotificationService {
  constructor() {}

  async createNotification(notification: INotification): Promise<void> {
    try {
      const newNotification = new notificationModel(notification);
      newNotification.save();
    } catch (error) {
      handleUnknownError(error);
    }
  }

  async createNotificationByReferenceAndActionType(
    notificationReferenceType: NotificationReferenceType,
    actionType: NotificationActionType,
    userId: string,
    referenceId: string
  ): Promise<void> {
    try {
      switch (notificationReferenceType) {
        case NotificationReferenceType.TASK: {
          switch (actionType) {
            case NotificationActionType.ASSIGNED:
              {
                const notification = {
                  userId,
                  title: "Task assigned",
                  message: "You have been assigned a task",
                  referenceId,
                  referenceType: notificationReferenceType,
                  actionType,
                };
                this.createNotification(notification);
              }
              break;
          }
          break;
        }
      }
    } catch (error) {
      handleUnknownError(error);
    }
  }
}
