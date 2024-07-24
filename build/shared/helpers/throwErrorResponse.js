"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const throwErrorResponse = ({ res, statusCode, operation, error, }) => {
    console.error("Error:", error.message);
    res.status(statusCode).json({
        msg: "Internal Server Error",
        statusCode,
        error: error.message,
        operation,
    });
};
exports.default = throwErrorResponse;
