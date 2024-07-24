"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPostalCode = void 0;
const isValidPostalCode = (postalCode) => {
    const regex = /^\d{5}$/;
    return regex.test(postalCode);
};
exports.isValidPostalCode = isValidPostalCode;
