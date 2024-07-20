import { NotificationDatasource } from "../../domain";
import { NotificationEntity } from "../../domain/entities";
import { NotificationModel } from "../db/mongo/models/notification.model";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo";

export class NotificationDataSourceMongoImp
  extends BaseDatasourceMongoImp<NotificationEntity>
  implements NotificationDatasource
{
  constructor() {
    super(NotificationModel, NotificationEntity);
  }
}
