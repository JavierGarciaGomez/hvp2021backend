"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const BaseError_1 = require("../domain/errors/BaseError");
// Error-handling middleware
const errorHandler = (err, req, res, next) => {
    if (err instanceof BaseError_1.BaseError) {
        // Handle custom errors
        res.status(err.statusCode).json({
            statusCode: err.statusCode,
            typeName: err.typeName,
            message: err.message,
            detail: err.detail,
            error: err.error,
            isOperational: err.isOperational,
            ref: "Not implemented documentation",
        });
    }
    else {
        // Handle other unexpected errors
        console.error(err);
        res.status(500).json({
            statusCode: 500,
            typeName: "InternalServerError",
            message: "Internal Server Error",
            detail: "Something went wrong",
            error: "INTERNAL_SERVER_ERROR",
            isOperational: false,
        });
    }
};
exports.errorHandler = errorHandler;
// ... (rest of your middleware and route setup)
// Add the error-handling middleware at the end
