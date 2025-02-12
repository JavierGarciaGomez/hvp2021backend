"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateRandomPassword = exports.handleUnknownError = exports.buildRelativePath = void 0;
const BaseError_1 = require("../errors/BaseError");
const buildRelativePath = (firstPart, secondPart, resourceId) => {
    let path = `${firstPart}/${secondPart}`;
    if (resourceId) {
        path = path.replace(":id", resourceId);
    }
    return path;
};
exports.buildRelativePath = buildRelativePath;
const handleUnknownError = (error) => {
    if (error instanceof Error) {
        throw BaseError_1.BaseError.internalServer(error.message);
    }
    throw BaseError_1.BaseError.internalServer("Unknown error");
};
exports.handleUnknownError = handleUnknownError;
const generateRandomPassword = () => {
    const characters = "abcdefghijklmnopqrstuvwxyz0123456789";
    let password = "";
    for (let i = 0; i < 6; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        password += characters[randomIndex];
    }
    return password;
};
exports.generateRandomPassword = generateRandomPassword;
