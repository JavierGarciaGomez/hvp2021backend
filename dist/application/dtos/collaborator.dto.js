"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorDTO = void 0;
const domain_1 = require("../../domain");
const helpers_1 = require("../../shared/helpers");
class CollaboratorDTO {
    constructor(options) {
        this.id = options.id;
        this.first_name = options.first_name;
        this.last_name = options.last_name;
        this.role = options.role;
        this.col_code = options.col_code;
        this.col_numId = options.col_numId;
        this.isActive = options.isActive;
        this.gender = options.gender;
        this.imgUrl = options.imgUrl;
        this.accessCode = options.accessCode;
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
    }
    static create(data) {
        const errors = this.validateCreate(data);
        (0, helpers_1.checkForErrors)(errors);
        return new CollaboratorDTO(data);
    }
    static update(data) {
        const errors = this.commonValidation(data);
        (0, helpers_1.checkForErrors)(errors);
        return new CollaboratorDTO(data);
    }
    static register(data) {
        const errors = this.validateRegister(data);
        (0, helpers_1.checkForErrors)(errors);
        return Object.assign(Object.assign({}, data), { isRegistered: true });
    }
    static validateCreate(data) {
        const errors = this.commonValidation(data);
        if (!data.first_name)
            errors.push("First name is required");
        if (!data.last_name)
            errors.push("Last name is required");
        if (!data.role)
            errors.push("Role is required");
        if (!data.col_code)
            errors.push("Col code is required");
        if (data.isActive === undefined)
            errors.push("IsActive is required");
        return errors;
    }
    static validateRegister(data) {
        const errors = this.commonValidation(data);
        if (!data.email)
            errors.push("Email is required");
        if (!data.password)
            errors.push("Password is required");
        if (!data.col_code)
            errors.push("Col code is required");
        if (!data.accessCode)
            errors.push("Access code is required");
        return errors;
    }
    static commonValidation(data) {
        const errors = [];
        if (data.role && !(0, helpers_1.isValidEnum)(domain_1.CollaboratorRole, data.role)) {
            errors.push("Role must be of type CollaboratorRole");
        }
        if (data.password && data.password.length < 6) {
            errors.push("Password must be at least 6 characters long");
        }
        if (data.col_code) {
            if (data.col_code.length !== 3)
                errors.push("Col code must be 3 characters long");
            if (!(0, helpers_1.isAlphabetical)(data.col_code))
                errors.push("Col code must be alphabetical");
        }
        return errors;
    }
}
exports.CollaboratorDTO = CollaboratorDTO;
