"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = void 0;
const enums_1 = require("../enums");
class BaseError extends Error {
    constructor(options) {
        // Add isOperational to constructor parameters
        const { statusCode, typeName, message, isOperational, detail } = options;
        super(message);
        this.statusCode = statusCode;
        this.typeName = typeName;
        this.message = message;
        this.isOperational = isOperational;
        this.detail = detail;
        this.error = enums_1.HttpStatusCode[statusCode];
        Error.captureStackTrace(this);
    }
    static createError(statusCode, message, detail) {
        detail = detail !== null && detail !== void 0 ? detail : message;
        const typeName = enums_1.HttpStatusCode[statusCode];
        return new BaseError({
            statusCode,
            typeName,
            message,
            isOperational: true,
            detail,
        });
    }
    static badRequest(message, detail) {
        return BaseError.createError(enums_1.HttpStatusCode.BAD_REQUEST, message, detail);
    }
    static unauthorized(message, detail) {
        return BaseError.createError(enums_1.HttpStatusCode.UNAUTHORIZED, message, detail);
    }
    static forbidden(message, detail) {
        return BaseError.createError(enums_1.HttpStatusCode.FORBIDDEN, message, detail);
    }
    static notFound(message, detail) {
        return BaseError.createError(enums_1.HttpStatusCode.NOT_FOUND, message, detail);
    }
    static notImplemented(message, detail) {
        return BaseError.createError(enums_1.HttpStatusCode.INTERNAL_SERVER, message);
    }
    static conflict(message, detail) {
        return BaseError.createError(enums_1.HttpStatusCode.CONFLICT, message, detail);
    }
    static internalServer(message, detail) {
        return BaseError.createError(enums_1.HttpStatusCode.INTERNAL_SERVER, message, detail);
    }
}
exports.BaseError = BaseError;
