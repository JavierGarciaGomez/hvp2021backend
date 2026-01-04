import { Request, Response, NextFunction } from "express";
import { BaseError } from "../../shared";
import { ApiErrorResponse, ErrorCode } from "../../shared/interfaces/api-response";
import { HttpStatusCode } from "../../shared/enums";

/**
 * Extract resource name from URL path
 * /api/collaborators/123 -> "collaborators"
 * /api/company-settings -> "company-settings"
 */
function extractResource(url: string): string {
  const parts = url.split("/").filter(Boolean);
  // Skip "api" prefix if present
  const startIndex = parts[0] === "api" ? 1 : 0;
  return parts[startIndex] || "unknown";
}

/**
 * Map HTTP status code to ErrorCode
 */
function mapStatusToErrorCode(statusCode: number): ErrorCode {
  switch (statusCode) {
    case 400:
      return "BAD_REQUEST";
    case 401:
      return "UNAUTHORIZED";
    case 403:
      return "FORBIDDEN";
    case 404:
      return "NOT_FOUND";
    case 409:
      return "CONFLICT";
    default:
      return "INTERNAL_ERROR";
  }
}

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const resource = extractResource(req.originalUrl || req.url);

  if (err instanceof BaseError) {
    console.error(`[${resource}] ${err.message}`);

    const response: ApiErrorResponse = {
      ok: false,
      status_code: err.statusCode,
      resource,
      error: {
        code: mapStatusToErrorCode(err.statusCode),
        message: err.message,
        ...(err.detail && typeof err.detail === "object" && { details: err.detail }),
      },
    };

    return res.status(err.statusCode).json(response);
  }

  // Handle unexpected errors
  console.error(`[${resource}] Unexpected error:`, err);

  const response: ApiErrorResponse = {
    ok: false,
    status_code: HttpStatusCode.INTERNAL_SERVER,
    resource,
    error: {
      code: "INTERNAL_ERROR",
      message: err.message || "An unexpected error occurred",
    },
  };

  return res.status(HttpStatusCode.INTERNAL_SERVER).json(response);
};
