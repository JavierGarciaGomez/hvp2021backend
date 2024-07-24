"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationDto = void 0;
const enums_1 = require("../../domain/enums");
const helpers_1 = require("../../shared/helpers");
class NotificationDto {
    constructor({ user, title, message, referenceId, referenceType, actionType, read, createdAt, createdBy, updatedAt, updatedBy, }) {
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
    static create(data) {
        return this.validate(data);
    }
    static update(data) {
        return this.validate(data);
    }
    static validate(data) {
        const { user, title, message, referenceId, referenceType, actionType } = data;
        const errors = [];
        if (!user)
            errors.push("User is required");
        if (!title)
            errors.push("Title is required");
        if (!message)
            errors.push("Message is required");
        if (!referenceId)
            errors.push("ReferenceId is required");
        if (!referenceType)
            errors.push("ReferenceType is required");
        if (!actionType)
            errors.push("ActionType is required");
        if (actionType && !(0, helpers_1.isValidEnum)(enums_1.NotificationActionType, actionType)) {
            errors.push("ActionType must be of type NotificationActionType");
        }
        if (referenceType &&
            !(0, helpers_1.isValidEnum)(enums_1.NotificationReferenceType, referenceType)) {
            errors.push("ReferenceType must be of type NotificationReferenceType");
        }
        if (errors.length) {
            throw new Error(errors.join(", "));
        }
        return new NotificationDto(Object.assign({}, data));
    }
}
exports.NotificationDto = NotificationDto;
