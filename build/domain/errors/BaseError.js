"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseError = exports.HttpStatusCode = void 0;
var HttpStatusCode;
(function (HttpStatusCode) {
    // Informational
    HttpStatusCode[HttpStatusCode["CONTINUE"] = 100] = "CONTINUE";
    // Success
    HttpStatusCode[HttpStatusCode["OK"] = 200] = "OK";
    HttpStatusCode[HttpStatusCode["CREATED"] = 201] = "CREATED";
    HttpStatusCode[HttpStatusCode["ACCEPTED"] = 202] = "ACCEPTED";
    HttpStatusCode[HttpStatusCode["NO_CONTENT"] = 204] = "NO_CONTENT";
    // Redirection
    HttpStatusCode[HttpStatusCode["MOVED_PERMANENTLY"] = 301] = "MOVED_PERMANENTLY";
    // Client Errors
    HttpStatusCode[HttpStatusCode["BAD_REQUEST"] = 400] = "BAD_REQUEST";
    HttpStatusCode[HttpStatusCode["UNAUTHORIZED"] = 401] = "UNAUTHORIZED";
    HttpStatusCode[HttpStatusCode["FORBIDDEN"] = 403] = "FORBIDDEN";
    HttpStatusCode[HttpStatusCode["NOT_FOUND"] = 404] = "NOT_FOUND";
    HttpStatusCode[HttpStatusCode["METHOD_NOT_ALLOWED"] = 405] = "METHOD_NOT_ALLOWED";
    HttpStatusCode[HttpStatusCode["CONFLICT"] = 409] = "CONFLICT";
    HttpStatusCode[HttpStatusCode["GONE"] = 410] = "GONE";
    HttpStatusCode[HttpStatusCode["PRECONDITION_FAILED"] = 412] = "PRECONDITION_FAILED";
    HttpStatusCode[HttpStatusCode["UNSUPPORTED_MEDIA_TYPE"] = 415] = "UNSUPPORTED_MEDIA_TYPE";
    // Server Errors
    HttpStatusCode[HttpStatusCode["INTERNAL_SERVER"] = 500] = "INTERNAL_SERVER";
    HttpStatusCode[HttpStatusCode["NOT_IMPLEMENTED"] = 501] = "NOT_IMPLEMENTED";
    HttpStatusCode[HttpStatusCode["BAD_GATEWAY"] = 502] = "BAD_GATEWAY";
    HttpStatusCode[HttpStatusCode["SERVICE_UNAVAILABLE"] = 503] = "SERVICE_UNAVAILABLE";
    HttpStatusCode[HttpStatusCode["GATEWAY_TIMEOUT"] = 504] = "GATEWAY_TIMEOUT";
    HttpStatusCode[HttpStatusCode["HTTP_VERSION_NOT_SUPPORTED"] = 505] = "HTTP_VERSION_NOT_SUPPORTED";
})(HttpStatusCode || (exports.HttpStatusCode = HttpStatusCode = {}));
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
        this.error = HttpStatusCode[statusCode];
        Error.captureStackTrace(this);
    }
    static createError(statusCode, message, detail) {
        detail = detail !== null && detail !== void 0 ? detail : message;
        const typeName = HttpStatusCode[statusCode];
        return new BaseError({
            statusCode,
            typeName,
            message,
            isOperational: true,
            detail,
        });
    }
    static badRequest(message, detail) {
        return BaseError.createError(HttpStatusCode.BAD_REQUEST, message, detail);
    }
    static unauthorized(message, detail) {
        return BaseError.createError(HttpStatusCode.UNAUTHORIZED, message, detail);
    }
    static forbidden(message, detail) {
        return BaseError.createError(HttpStatusCode.FORBIDDEN, message, detail);
    }
    static notFound(message, detail) {
        return BaseError.createError(HttpStatusCode.NOT_FOUND, message, detail);
    }
    static internalServer(message, detail) {
        return BaseError.createError(HttpStatusCode.INTERNAL_SERVER, message, detail);
    }
}
exports.BaseError = BaseError;
