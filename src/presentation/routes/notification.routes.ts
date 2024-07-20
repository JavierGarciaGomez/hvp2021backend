import { Router } from "express";
import {
  NotificationDataSourceMongoImp,
  NotificationRepositoryImpl,
} from "../../infrastructure";
import { NotificationService } from "../../application";
import { NotificationController } from "../controllers/notification.controller";
import { BaseCRUDRoutes } from "./base-crud.routes";

export class NotificationRoutes extends BaseCRUDRoutes {
  protected initializeRoutes(): void {
    const datasource = new NotificationDataSourceMongoImp();
    const repository = new NotificationRepositoryImpl(datasource);
    const service = new NotificationService(repository);
    const controller = new NotificationController(service);

    this.setupCrudRoutes(controller);
  }
}
