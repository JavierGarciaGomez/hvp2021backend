import { NotificationEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class NotificationDatasource extends BaseDatasource<NotificationEntity> {
  abstract createMany(
    notifications: NotificationEntity[]
  ): Promise<NotificationEntity[]>;
}
