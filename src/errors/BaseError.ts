/**
 * {
  "status_code": 404, // HTTP status code
  "error": "Not Found", // HTTP status message
  "type_name": "EntityNotFoundError", // Error type
  "message": "Unknown Widget", // Error message
  "detail": "Could not find widget with id: '123'", //  Error details
  "ref": "https://developers.apideck.com/errors#entitynotfounderror" // Reference to documentation
}
 */

export interface ErrorResponse {
  statusCode: HttpStatusCode;
  typeName: string;
  message: string;
  detail: string | Record<string, unknown>;
  error: keyof typeof HttpStatusCode;
  isOperational: boolean;
  ref?: string;
}

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
  detail: string | Record<string, unknown>;
}

export class BaseError extends Error {
  public readonly error: string;
  public readonly statusCode: HttpStatusCode;
  public readonly typeName: string;
  public readonly message: string;
  public readonly isOperational: boolean;
  public readonly detail: string | Record<string, unknown>;

  constructor(options: BaseErrorOptions & { isOperational: boolean }) {
    // Add isOperational to constructor parameters
    const { statusCode, typeName, message, isOperational, detail } = options;

    super(message);

    this.statusCode = statusCode;
    this.typeName = typeName;
    this.message = message;
    this.isOperational = isOperational; // Assign isOperational
    this.detail = detail;
    this.error = HttpStatusCode[statusCode];

    Error.captureStackTrace(this);
  }
}

//free to extend the BaseError
// class APIError extends BaseError {
//   constructor(
//     name,
//     httpCode = HttpStatusCode.INTERNAL_SERVER,
//     isOperational = true,
//     description = "internal server error"
//   ) {
//     super(name, httpCode, isOperational, description);
//   }
// }
