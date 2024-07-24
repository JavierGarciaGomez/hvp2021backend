"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationActionType = exports.NotificationReferenceType = void 0;
var NotificationReferenceType;
(function (NotificationReferenceType) {
    NotificationReferenceType["TASK"] = "TASK";
    NotificationReferenceType["BILL_CREATION_INFO"] = "BILL_CREATION_INFO";
    NotificationReferenceType["AUTH_ACTIVITY"] = "AUTH_ACTIVITY";
    NotificationReferenceType["TIME_OFF_REQUEST"] = "TIME_OFF_REQUEST";
    NotificationReferenceType["USER"] = "USER";
})(NotificationReferenceType || (exports.NotificationReferenceType = NotificationReferenceType = {}));
var NotificationActionType;
(function (NotificationActionType) {
    NotificationActionType["ASSIGNED"] = "ASSIGNED";
    NotificationActionType["UNASSIGNED"] = "UNASSIGNED";
    NotificationActionType["STATUS_CHANGED"] = "STATUS_CHANGED";
    NotificationActionType["COMPLETED"] = "COMPLETED";
    NotificationActionType["CANCELED"] = "CANCELED";
    NotificationActionType["AWAITING_APPROVAL"] = "AWAITING_APPROVAL";
    NotificationActionType["APPROVED"] = "APPROVED";
    NotificationActionType["REJECTED"] = "REJECTED";
    NotificationActionType["AWAITING_REVIEW"] = "AWAITING_REVIEW";
})(NotificationActionType || (exports.NotificationActionType = NotificationActionType = {}));
