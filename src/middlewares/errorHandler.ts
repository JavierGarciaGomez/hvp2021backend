import { Request, Response, NextFunction } from "express";
import { BaseError } from "../errors/BaseError";

// Error-handling middleware
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof BaseError) {
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
  } else {
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

// ... (rest of your middleware and route setup)

// Add the error-handling middleware at the end
