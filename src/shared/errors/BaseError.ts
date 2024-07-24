import { HttpStatusCode } from "../enums";

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
