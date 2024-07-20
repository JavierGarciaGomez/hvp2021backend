import { Request, Response } from "express";
import {
  NotificationService,
  ResponseFormatterService,
} from "../../application";
import { NotificationDto } from "../../application/dtos/notification.dto";
import { buildQueryOptions } from "../../shared/helpers";
import { BaseController } from "./base.controller";
import { NotificationEntity } from "../../domain";

export class NotificationController extends BaseController<
  NotificationEntity,
  NotificationDto
> {
  protected resource = "notification";
  protected path = "/notifications";
  constructor(protected notificationService: NotificationService) {
    super(notificationService, NotificationDto);
  }
}
