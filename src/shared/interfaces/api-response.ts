/**
 * Unified API Response Format
 *
 * All API responses follow this structure for consistency.
 * Frontend can always check `response.ok` to determine success/failure.
 */

// ============================================================================
// SUCCESS RESPONSES
// ============================================================================

export interface ApiSuccessResponse<T> {
  ok: true;
  status_code: number;
  resource: string;
  operation: Operation;
  data: T;
  message?: string;
  meta?: PaginationMeta;
}

export type Operation =
  | "one"
  | "all"
  | "create"
  | "createMany"
  | "update"
  | "updateMany"
  | "delete"
  | "deleteMany";

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// ============================================================================
// ERROR RESPONSES
// ============================================================================

export interface ApiErrorResponse {
  ok: false;
  status_code: number;
  resource: string;
  error: ApiError;
}

export interface ApiError {
  code: ErrorCode;
  message: string;
  details?: Record<string, unknown>;
}

/**
 * Error codes - use these in frontend for i18n or custom handling
 */
export type ErrorCode =
  | "BAD_REQUEST"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "INTERNAL_ERROR";

// ============================================================================
// UNION TYPE
// ============================================================================

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
