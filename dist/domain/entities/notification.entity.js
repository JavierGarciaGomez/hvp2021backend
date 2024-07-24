"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationEntity = void 0;
class NotificationEntity {
    constructor({ id, user, title, message, referenceId, referenceType, actionType, read, createdAt, createdBy, updatedAt, updatedBy, }) {
        this.id = id;
        this.user = user;
        this.title = title;
        this.message = message;
        this.referenceId = referenceId;
        this.referenceType = referenceType;
        this.actionType = actionType;
        this.read = read;
        this.createdAt = createdAt;
        this.createdBy = createdBy;
        this.updatedAt = updatedAt;
        this.updatedBy = updatedBy;
    }
    static fromDocument(document) {
        return new NotificationEntity({
            id: document.id,
            user: document.user.toString(),
            title: document.title,
            message: document.message,
            referenceId: document.referenceId,
            referenceType: document.referenceType,
            read: document.read,
            actionType: document.actionType,
            createdAt: document.createdAt,
            createdBy: document.createdBy,
            updatedAt: document.updatedAt,
            updatedBy: document.updatedBy,
        });
    }
}
exports.NotificationEntity = NotificationEntity;
