"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAlphabetical = exports.isValidEnum = exports.isBoolean = void 0;
const isBoolean = (value) => {
    return typeof value === "boolean";
};
exports.isBoolean = isBoolean;
const isValidEnum = (enumType, value) => {
    return Object.values(enumType).includes(value);
};
exports.isValidEnum = isValidEnum;
const isAlphabetical = (value) => {
    return /^[a-zA-Z]+$/.test(value);
};
exports.isAlphabetical = isAlphabetical;
