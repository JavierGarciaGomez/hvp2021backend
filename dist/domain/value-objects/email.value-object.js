"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Email = void 0;
class Email {
    constructor(value) {
        this.value = value;
        if (!this.validate(value)) {
            throw new Error("Invalid email address");
        }
    }
    validate(email) {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    getValue() {
        return this.value;
    }
}
exports.Email = Email;
