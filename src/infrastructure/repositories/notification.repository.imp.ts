import { NotificationDatasource, NotificationRepository } from "../../domain";
import { NotificationEntity } from "../../domain/entities";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class NotificationRepositoryImpl
  extends BaseRepositoryImpl<NotificationEntity>
  implements NotificationRepository
{
  constructor(protected readonly datasource: NotificationDatasource) {
    super(datasource);
  }
}
