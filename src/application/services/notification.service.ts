import {
  NotificationActionType,
  NotificationReferenceType,
} from "./../../domain/enums/notification.enums";
import { NotificationEntity } from "../../domain/entities";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

import { NotificationDto } from "../dtos/notification.dto";
import { CustomQueryOptions } from "../../shared/interfaces";
import { BaseService } from "./base.service";

interface NotifyCollaboratorsProps {
  message: string;
  referenceId: string;
  referenceType: NotificationReferenceType;
  actionType: NotificationActionType;
  collaboratorIds: string[];
}

export class NotificationService extends BaseService<
  NotificationEntity,
  NotificationDto
> {
  constructor(protected readonly repository: NotificationRepository) {
    super(repository, NotificationEntity);
  }

  async notifyCollaborators({
    message,
    referenceId,
    referenceType,
    actionType,
    collaboratorIds,
  }: NotifyCollaboratorsProps): Promise<void> {
    const notifications = collaboratorIds.map((collaboratorId) => {
      return new NotificationEntity({
        user: collaboratorId,
        title: "Task assigned",
        message,
        referenceId,
        referenceType,
        actionType,
        read: false,
      });
    });
    await this.repository.createMany(notifications);
  }
}
