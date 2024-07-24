"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CollaboratorLoginDto = void 0;
const BaseError_1 = require("../../../shared/errors/BaseError");
const helpers_1 = require("../../../shared/helpers");
class CollaboratorLoginDto {
    constructor(data) {
        this.data = data;
    }
    static login(data) {
        const { email, password } = data;
        if (!email || !password) {
            throw BaseError_1.BaseError.badRequest("Email and password are required");
        }
        if (!(0, helpers_1.isValidEmail)(email)) {
            throw BaseError_1.BaseError.badRequest("Invalid email");
        }
        if (password.length < 5) {
            throw BaseError_1.BaseError.badRequest("Password must have at least 5 characters");
        }
        return new CollaboratorLoginDto(data);
    }
}
exports.CollaboratorLoginDto = CollaboratorLoginDto;
