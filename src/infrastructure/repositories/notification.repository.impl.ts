import { NotificationDatasource } from "../../domain";
import { NotificationEntity } from "../../domain/entities";
import { NotificationRepository } from "../../domain/repositories/notification.repository";
import { CustomQueryOptions } from "../../shared/interfaces";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class NotificationRepositoryImpl
  extends BaseRepositoryImpl<NotificationEntity>
  implements NotificationRepository
{
  constructor(protected readonly datasource: NotificationDatasource) {
    super(datasource);
  }
}
