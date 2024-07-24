import {
  NotificationDataSourceMongoImp,
  NotificationRepositoryImpl,
} from "../../infrastructure";
import { NotificationService } from "../services";

export const createNotificationService = () => {
  const datasource = new NotificationDataSourceMongoImp();
  const repository = new NotificationRepositoryImpl(datasource);
  const service = new NotificationService(repository);

  return service;
};
