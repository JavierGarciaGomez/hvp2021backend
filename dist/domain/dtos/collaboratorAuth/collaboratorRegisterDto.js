"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorRegisterDto = void 0;
const BaseError_1 = require("../../../shared/errors/BaseError");
const helpers_1 = require("../../../shared/helpers");
class CollaboratorRegisterDto {
    constructor(data) {
        this.data = data;
    }
    static register(data) {
        const { email, password, col_code, accessCode } = data;
        if (!email || !password) {
            throw BaseError_1.BaseError.badRequest("Email and password are required");
        }
        if (!(0, helpers_1.isValidEmail)(email)) {
            throw BaseError_1.BaseError.badRequest("Invalid email");
        }
        if (password.length < 5) {
            throw BaseError_1.BaseError.badRequest("Password must have at least 5 characters");
        }
        if (!col_code || !accessCode) {
            throw BaseError_1.BaseError.badRequest("Colaborator code and access code are required");
        }
        return new CollaboratorRegisterDto(data);
    }
}
exports.CollaboratorRegisterDto = CollaboratorRegisterDto;
