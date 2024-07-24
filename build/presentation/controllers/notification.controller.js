"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationController = void 0;
const notification_dto_1 = require("../../application/dtos/notification.dto");
const base_controller_1 = require("./base.controller");
class NotificationController extends base_controller_1.BaseController {
    constructor(notificationService) {
        super(notificationService, notification_dto_1.NotificationDto);
        this.notificationService = notificationService;
        this.resource = "notification";
        this.path = "/notifications";
    }
}
exports.NotificationController = NotificationController;
