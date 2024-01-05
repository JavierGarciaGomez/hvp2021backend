import {
  SingleSuccessResponse,
  ListSuccessResponse,
} from "../../data/types/responses";
import { HttpStatusCode } from "../../domain/errors/BaseError";

interface FormatListResponseParams<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
  path: string;
  resource: string;
}

interface FormatSingleResponseParams<T> {
  data: T;
  resource: string;
}

export class SuccessResponseFormatter {
  static formatListResponse<T>(
    options: FormatListResponseParams<T>
  ): ListSuccessResponse<T> {
    const { data, page, limit, total, path, resource } = options;

    return {
      status_code: HttpStatusCode.OK,
      status: HttpStatusCode[HttpStatusCode.OK],
      resource: resource,
      operation: "all",
      data: data,
      meta: {
        total,
        itemsOnPage: data.length,
        page,
        limit,
      },
      links: {
        next:
          page * limit < total
            ? `${path}?page=${page + 1}&limit=${limit}`
            : undefined,
        prev:
          page - 1 > 0 ? `${path}?page=${page - 1}&limit=${limit}` : undefined,
        current: `${path}?page=${page}&limit=${limit}`,
      },
    };
  }

  static formatGetOneResponse<T>(
    options: FormatSingleResponseParams<T>
  ): SingleSuccessResponse<T> {
    const { data, resource } = options;
    return {
      status_code: HttpStatusCode.CREATED,
      status: HttpStatusCode[HttpStatusCode.CREATED],
      resource: resource,
      operation: "one",
      data: data,
    };
  }

  static fortmatCreateResponse<T>(
    options: FormatSingleResponseParams<T>
  ): SingleSuccessResponse<T> {
    const { data, resource } = options;
    return {
      status_code: HttpStatusCode.CREATED,
      status: HttpStatusCode[HttpStatusCode.CREATED],
      resource: resource,
      operation: "add",
      data: data,
    };
  }

  static formatUpdateResponse<T>(
    options: FormatSingleResponseParams<T>
  ): SingleSuccessResponse<T> {
    const { data, resource } = options;
    return {
      status_code: HttpStatusCode.OK,
      status: HttpStatusCode[HttpStatusCode.OK],
      resource: resource,
      operation: "update",
      data: data,
    };
  }
  static formatDeleteResponse<T>(
    options: FormatSingleResponseParams<T>
  ): SingleSuccessResponse<T> {
    const { data, resource } = options;
    return {
      status_code: HttpStatusCode.OK,
      status: HttpStatusCode[HttpStatusCode.OK],
      resource: resource,
      operation: "delete",
      data: data,
    };
  }
}
