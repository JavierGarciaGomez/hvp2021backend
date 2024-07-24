export enum HttpStatusCode {
  // Informational
  CONTINUE = 100,

  // Success
  OK = 200,
  CREATED = 201,
  ACCEPTED = 202,
  NO_CONTENT = 204,

  // Redirection
  MOVED_PERMANENTLY = 301,

  // Client Errors
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  FORBIDDEN = 403,
  NOT_FOUND = 404,
  METHOD_NOT_ALLOWED = 405,
  CONFLICT = 409,
  GONE = 410,
  PRECONDITION_FAILED = 412,
  UNSUPPORTED_MEDIA_TYPE = 415,

  // Server Errors
  INTERNAL_SERVER = 500,
  NOT_IMPLEMENTED = 501,
  BAD_GATEWAY = 502,
  SERVICE_UNAVAILABLE = 503,
  GATEWAY_TIMEOUT = 504,
  HTTP_VERSION_NOT_SUPPORTED = 505,
}

interface BaseErrorOptions {
  statusCode: HttpStatusCode;
  typeName: string;
  message: string;
  isOperational: boolean;
  detail: ErrorDetail;
}

type ErrorDetail = string | Record<string, unknown>;

export class BaseError extends Error {
  public readonly error: string;
  public readonly statusCode: HttpStatusCode;
  public readonly typeName: string;
  public readonly message: string;
  public readonly detail: ErrorDetail;
  public isOperational: boolean;

  constructor(options: BaseErrorOptions) {
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

  private static createError(
    statusCode: HttpStatusCode,
    message: string,
    detail?: ErrorDetail
  ) {
    detail = detail ?? message;
    const typeName = HttpStatusCode[statusCode];
    return new BaseError({
      statusCode,
      typeName,
      message,
      isOperational: true,
      detail,
    });
  }

  static badRequest(message: string, detail?: ErrorDetail) {
    return BaseError.createError(HttpStatusCode.BAD_REQUEST, message, detail);
  }

  static unauthorized(message: string, detail?: ErrorDetail) {
    return BaseError.createError(HttpStatusCode.UNAUTHORIZED, message, detail);
  }

  static forbidden(message: string, detail?: ErrorDetail) {
    return BaseError.createError(HttpStatusCode.FORBIDDEN, message, detail);
  }

  static notFound(message: string, detail?: ErrorDetail) {
    return BaseError.createError(HttpStatusCode.NOT_FOUND, message, detail);
  }

  static internalServer(message: string, detail?: ErrorDetail) {
    return BaseError.createError(
      HttpStatusCode.INTERNAL_SERVER,
      message,
      detail
    );
  }
}
