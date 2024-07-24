"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorEntity = void 0;
class CollaboratorEntity {
    constructor(options) {
        this._id = options.id;
        this.id = options.id;
        this.first_name = options.first_name;
        this.last_name = options.last_name;
        this.role = options.role;
        this.col_code = options.col_code;
        this.col_numId = options.col_numId;
        this.isActive = options.isActive;
        this.isRegistered = options.isRegistered;
        this.email = options.email;
        this.password = options.password;
        this.position = options.position;
        this.isDisplayedWeb = options.isDisplayedWeb;
        this.textPresentation = options.textPresentation;
        this.registeredDate = options.registeredDate;
        this.lastLogin = options.lastLogin;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
        this.vacationsTakenBefore2021 = options.vacationsTakenBefore2021;
        this.createdAt = options.createdAt;
        this.createdBy = options.createdBy;
        this.updatedAt = options.updatedAt;
        this.updatedBy = options.updatedBy;
        this.imgUrl = options.imgUrl;
        this.gender = options.gender;
        this.accessCode = options.accessCode;
    }
    static fromDocument(document) {
        return new CollaboratorEntity({
            _id: document.id,
            id: document.id,
            first_name: document.first_name,
            last_name: document.last_name,
            role: document.role,
            col_code: document.col_code,
            col_numId: document.col_numId,
            isActive: document.isActive,
            gender: document.gender,
            imgUrl: document.imgUrl,
            accessCode: document.accessCode,
            isRegistered: document.isRegistered,
            email: document.email,
            password: document.password,
            position: document.position,
            isDisplayedWeb: document.isDisplayedWeb,
            textPresentation: document.textPresentation,
            registeredDate: document.registeredDate,
            lastLogin: document.lastLogin,
            startDate: document.startDate,
            endDate: document.endDate,
            vacationsTakenBefore2021: document.vacationsTakenBefore2021,
            createdAt: document.createdAt,
            createdBy: document.createdBy,
            updatedAt: document.updatedAt,
            updatedBy: document.updatedBy,
        });
    }
    toPublicCollaborator() {
        return {
            id: this.id,
            first_name: this.first_name,
            last_name: this.last_name,
            col_code: this.col_code,
            position: this.position,
            imgUrl: this.imgUrl,
            textPresentation: this.textPresentation,
        };
    }
    toCollaboratorAuth() {
        return {
            uid: this.id,
            col_code: this.col_code,
            role: this.role,
            imgUrl: this.imgUrl,
        };
    }
}
exports.CollaboratorEntity = CollaboratorEntity;
