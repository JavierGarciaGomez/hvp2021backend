"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorEntity = void 0;
// todo response interface
class CollaboratorEntity {
    constructor(options) {
        this._id = options._id;
        this.id = options.id;
        this.first_name = options.first_name;
        this.last_name = options.last_name;
        this.gender = options.gender;
        this.email = options.email;
        this.phoneNumber = options.phoneNumber;
        this.phoneNumber2 = options.phoneNumber2;
        this.address = options.address;
        this.curp = options.curp;
        this.imssNumber = options.imssNumber;
        this.rfcCode = options.rfcCode;
        this.emergencyContact = options.emergencyContact;
        this.emergencyContactPhone = options.emergencyContactPhone;
        this.role = options.role;
        this.imgUrl = options.imgUrl;
        this.accessCode = options.accessCode;
        this.isRegistered = options.isRegistered;
        this.password = options.password;
        this.isDisplayedWeb = options.isDisplayedWeb;
        this.textPresentation = options.textPresentation;
        this.registeredDate = options.registeredDate;
        this.lastLogin = options.lastLogin;
        this.vacationsTakenBefore2021 = options.vacationsTakenBefore2021;
        this.col_code = options.col_code;
        this.col_numId = options.col_numId;
        this.isActive = options.isActive;
        this.startDate = options.startDate;
        this.endDate = options.endDate;
        this.position = options.position;
        this.coverShift = options.coverShift;
        this.weeklyHours = options.weeklyHours;
        this.jobId = options.jobId;
        this.contractDate = options.contractDate;
        this.hasIMSS = options.hasIMSS;
        this.imssEnrollmentDate = options.imssEnrollmentDate;
        this.paymentType = options.paymentType;
        this.additionalCompensation = options.additionalCompensation;
        this.degree = options.degree;
        this.createdAt = options.createdAt;
        this.createdBy = options.createdBy;
        this.updatedAt = options.updatedAt;
        this.updatedBy = options.updatedBy;
    }
    static fromDocument(document) {
        return new CollaboratorEntity({
            _id: document.id,
            id: document.id,
            first_name: document.first_name,
            last_name: document.last_name,
            gender: document.gender,
            email: document.email,
            phoneNumber: document.phoneNumber,
            phoneNumber2: document.phoneNumber2,
            address: document.address,
            curp: document.curp,
            imssNumber: document.imssNumber,
            rfcCode: document.rfcCode,
            emergencyContact: document.emergencyContact,
            emergencyContactPhone: document.emergencyContactPhone,
            role: document.role,
            imgUrl: document.imgUrl,
            accessCode: document.accessCode,
            isRegistered: document.isRegistered,
            password: document.password,
            isDisplayedWeb: document.isDisplayedWeb,
            textPresentation: document.textPresentation,
            registeredDate: document.registeredDate,
            lastLogin: document.lastLogin,
            vacationsTakenBefore2021: document.vacationsTakenBefore2021,
            col_code: document.col_code,
            col_numId: document.col_numId,
            isActive: document.isActive,
            startDate: document.startDate,
            endDate: document.endDate,
            position: document.position,
            coverShift: document.coverShift,
            weeklyHours: document.weeklyHours,
            jobId: document.jobId,
            contractDate: document.contractDate,
            hasIMSS: document.hasIMSS,
            imssEnrollmentDate: document.imssEnrollmentDate,
            paymentType: document.paymentType,
            additionalCompensation: document.additionalCompensation,
            degree: document.degree,
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
