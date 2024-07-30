import {
  NotificationActionType,
  NotificationReferenceType,
} from "./../../domain/enums/notification.enums";
import { NotificationEntity } from "../../domain/entities";
import { NotificationRepository } from "../../domain/repositories/notification.repository";

import { NotificationDto } from "../dtos/notification.dto";
import { CustomQueryOptions } from "../../shared/interfaces";
import { BaseService } from "./base.service";
import { CollaboratorService } from "./collaborator.service";
import { CollaboratorRepositoryImpl } from "../../infrastructure";
import { createCollaboratorService } from "../factories/create-collaborator-service.factory";
import { buildQueryOptions } from "../../shared";
import { CollaboratorRole } from "../../domain";

interface NotifyCollaboratorsProps {
  message: string;
  referenceId: string;
  referenceType: NotificationReferenceType;
  actionType: NotificationActionType;
  collaboratorIds: string[];
  title: string;
}

interface NotifyCollaboratorProps {
  message: string;
  referenceId: string;
  referenceType: NotificationReferenceType;
  actionType: NotificationActionType;
  collaboratorId: string;
  title: string;
}

interface NotifyManagerProps {
  message: string;
  referenceId: string;
  referenceType: NotificationReferenceType;
  actionType: NotificationActionType;
  title: string;
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
    title,
  }: NotifyCollaboratorsProps): Promise<void> {
    const notifications = collaboratorIds.map((collaboratorId) => {
      return new NotificationEntity({
        user: collaboratorId,
        title,
        message,
        referenceId,
        referenceType,
        actionType,
        read: false,
      });
    });
    await this.repository.createMany(notifications);
  }

  async notifyCollaborator({
    message,
    referenceId,
    referenceType,
    actionType,
    collaboratorId,
    title,
  }: NotifyCollaboratorProps): Promise<void> {
    const notification = new NotificationEntity({
      user: collaboratorId,
      title,
      message,
      referenceId,
      referenceType,
      actionType,
      read: false,
    });

    await this.repository.create(notification);
  }

  public notifyManagers = async ({
    message,
    referenceId,
    referenceType,
    actionType,
    title,
  }: NotifyManagerProps): Promise<void> => {
    const collaboratorService = createCollaboratorService();
    const options = buildQueryOptions({
      role: [CollaboratorRole.admin, CollaboratorRole.admin],
    });
    const managers = await collaboratorService.getAll(options);
    const managerIds = managers.map((manager) => manager.id as string);
    return await this.notifyCollaborators({
      message,
      referenceId,
      referenceType,
      actionType,
      collaboratorIds: managerIds,
      title,
    });
  };

  public getResourceName(): string {
    return "notification";
  }
}
