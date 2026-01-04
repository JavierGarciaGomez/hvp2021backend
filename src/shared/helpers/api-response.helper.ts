import { Response } from "express";
import {
  ApiSuccessResponse,
  ApiErrorResponse,
  ErrorCode,
  PaginationMeta,
  Operation,
} from "../interfaces/api-response";
import { HttpStatusCode } from "../enums";

/**
 * API Response Helper
 *
 * Usage:
 *   return Api.success(res, "collaborators", "one", data);
 *   return Api.created(res, "collaborators", data);
 *   return Api.list(res, "collaborators", data, { total: 100, page: 1, limit: 10 });
 *   return Api.notFound(res, "collaborators", "Collaborator not found");
 */
export class ApiResponseHelper {
  // ===========================================================================
  // SUCCESS RESPONSES
  // ===========================================================================

  /**
   * 200 OK - Get one resource
   */
  static one<T>(res: Response, resource: string, data: T): Response {
    return this.successResponse(res, HttpStatusCode.OK, resource, "one", data);
  }

  /**
   * 200 OK - Get all resources (no pagination)
   */
  static all<T>(res: Response, resource: string, data: T[]): Response {
    return this.successResponse(res, HttpStatusCode.OK, resource, "all", data);
  }

  /**
   * 200 OK - Paginated list response
   */
  static list<T>(
    res: Response,
    resource: string,
    data: T[],
    pagination: { total: number; page: number; limit: number }
  ): Response {
    const meta: PaginationMeta = {
      total: pagination.total,
      page: pagination.page,
      limit: pagination.limit,
      totalPages: Math.ceil(pagination.total / pagination.limit),
    };

    const response: ApiSuccessResponse<T[]> = {
      ok: true,
      status_code: HttpStatusCode.OK,
      resource,
      operation: "all",
      data,
      meta,
    };
    return res.status(HttpStatusCode.OK).json(response);
  }

  /**
   * 201 Created - Single resource created
   */
  static created<T>(res: Response, resource: string, data: T, message?: string): Response {
    const response: ApiSuccessResponse<T> = {
      ok: true,
      status_code: HttpStatusCode.CREATED,
      resource,
      operation: "create",
      data,
      ...(message && { message }),
    };
    return res.status(HttpStatusCode.CREATED).json(response);
  }

  /**
   * 201 Created - Multiple resources created
   */
  static createdMany<T>(res: Response, resource: string, data: T[], message?: string): Response {
    const response: ApiSuccessResponse<T[]> = {
      ok: true,
      status_code: HttpStatusCode.CREATED,
      resource,
      operation: "createMany",
      data,
      ...(message && { message }),
    };
    return res.status(HttpStatusCode.CREATED).json(response);
  }

  /**
   * 200 OK - Single resource updated
   */
  static updated<T>(res: Response, resource: string, data: T, message?: string): Response {
    const response: ApiSuccessResponse<T> = {
      ok: true,
      status_code: HttpStatusCode.OK,
      resource,
      operation: "update",
      data,
      ...(message && { message }),
    };
    return res.status(HttpStatusCode.OK).json(response);
  }

  /**
   * 200 OK - Multiple resources updated
   */
  static updatedMany<T>(res: Response, resource: string, data: T[], message?: string): Response {
    const response: ApiSuccessResponse<T[]> = {
      ok: true,
      status_code: HttpStatusCode.OK,
      resource,
      operation: "updateMany",
      data,
      ...(message && { message }),
    };
    return res.status(HttpStatusCode.OK).json(response);
  }

  /**
   * 200 OK - Resource deleted
   */
  static deleted<T>(res: Response, resource: string, data?: T, message?: string): Response {
    const response: ApiSuccessResponse<T | null> = {
      ok: true,
      status_code: HttpStatusCode.OK,
      resource,
      operation: "delete",
      data: data ?? null,
      message: message ?? "Resource deleted successfully",
    };
    return res.status(HttpStatusCode.OK).json(response);
  }

  /**
   * 200 OK - Multiple resources deleted
   */
  static deletedMany(
    res: Response,
    resource: string,
    count: number,
    message?: string
  ): Response {
    const response: ApiSuccessResponse<{ deletedCount: number }> = {
      ok: true,
      status_code: HttpStatusCode.OK,
      resource,
      operation: "deleteMany",
      data: { deletedCount: count },
      message: message ?? `${count} resources deleted successfully`,
    };
    return res.status(HttpStatusCode.OK).json(response);
  }

  // ===========================================================================
  // ERROR RESPONSES
  // ===========================================================================

  /**
   * 400 Bad Request
   */
  static badRequest(
    res: Response,
    resource: string,
    message: string,
    details?: Record<string, unknown>
  ): Response {
    return this.errorResponse(res, HttpStatusCode.BAD_REQUEST, resource, "BAD_REQUEST", message, details);
  }

  /**
   * 400 Validation Error
   */
  static validationError(
    res: Response,
    resource: string,
    message: string,
    details?: Record<string, unknown>
  ): Response {
    return this.errorResponse(res, HttpStatusCode.BAD_REQUEST, resource, "VALIDATION_ERROR", message, details);
  }

  /**
   * 401 Unauthorized
   */
  static unauthorized(res: Response, resource: string, message?: string): Response {
    return this.errorResponse(
      res,
      HttpStatusCode.UNAUTHORIZED,
      resource,
      "UNAUTHORIZED",
      message ?? "Authentication required"
    );
  }

  /**
   * 403 Forbidden
   */
  static forbidden(res: Response, resource: string, message?: string): Response {
    return this.errorResponse(
      res,
      HttpStatusCode.FORBIDDEN,
      resource,
      "FORBIDDEN",
      message ?? "Insufficient permissions"
    );
  }

  /**
   * 404 Not Found
   */
  static notFound(res: Response, resource: string, message?: string): Response {
    return this.errorResponse(
      res,
      HttpStatusCode.NOT_FOUND,
      resource,
      "NOT_FOUND",
      message ?? "Resource not found"
    );
  }

  /**
   * 409 Conflict
   */
  static conflict(res: Response, resource: string, message: string): Response {
    return this.errorResponse(res, HttpStatusCode.CONFLICT, resource, "CONFLICT", message);
  }

  /**
   * 500 Internal Server Error
   */
  static internalError(res: Response, resource: string, message?: string): Response {
    return this.errorResponse(
      res,
      HttpStatusCode.INTERNAL_SERVER,
      resource,
      "INTERNAL_ERROR",
      message ?? "An unexpected error occurred"
    );
  }

  // ===========================================================================
  // PRIVATE HELPERS
  // ===========================================================================

  private static successResponse<T>(
    res: Response,
    statusCode: HttpStatusCode,
    resource: string,
    operation: Operation,
    data: T,
    message?: string
  ): Response {
    const response: ApiSuccessResponse<T> = {
      ok: true,
      status_code: statusCode,
      resource,
      operation,
      data,
      ...(message && { message }),
    };
    return res.status(statusCode).json(response);
  }

  private static errorResponse(
    res: Response,
    statusCode: HttpStatusCode,
    resource: string,
    code: ErrorCode,
    message: string,
    details?: Record<string, unknown>
  ): Response {
    const response: ApiErrorResponse = {
      ok: false,
      status_code: statusCode,
      resource,
      error: {
        code,
        message,
        ...(details && { details }),
      },
    };
    return res.status(statusCode).json(response);
  }
}

// Alias for shorter imports
export const Api = ApiResponseHelper;
