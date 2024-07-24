import { Response } from "express";

interface ThrowErrorResponseParams {
  res: Response;
  statusCode: number;
  operation: string;
  error: Error;
}

const throwErrorResponse = ({
  res,
  statusCode,
  operation,
  error,
}: ThrowErrorResponseParams): void => {
  console.error("Error:", error.message);
  res.status(statusCode).json({
    msg: "Internal Server Error",
    statusCode,
    error: error.message,
    operation,
  });
};

export default throwErrorResponse;
