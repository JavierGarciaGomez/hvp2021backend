import { envsPlugin } from "../../infrastructure/adapters";
import { HttpStatusCode } from "../../shared/enums";

interface CommonSuccessResponse<T> {
  status_code: number;
  status: string;
  resource: string;
  operation: string;
  data: T;
  ok: boolean;
}

interface ListSuccessResponse<T> extends CommonSuccessResponse<T[]> {
  meta?: {
    total: number;
    itemsOnPage: number;
    page: number;
    limit: number;
  };
  links?: {
    next?: string;
    prev?: string;
    current: string;
  };
}

interface UpdateManySuccessResponse<T> extends CommonSuccessResponse<T[]> {}

interface CreateManySuccessResponse<T> extends CommonSuccessResponse<T[]> {}
export interface SingleSuccessResponse<T> extends CommonSuccessResponse<T> {}

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

interface FormatUpdateManyResponseParams<T> {
  data: T[];
  resource: string;
}

interface FormatCreateManyResponseParams<T> {
  data: T[];
  resource: string;
}

export class ResponseFormatterService {
  static formatListResponse<T>(
    options: FormatListResponseParams<T>
  ): ListSuccessResponse<T> {
    const { data, page, limit, total, path, resource } = options;
    const fullPath = envsPlugin.BASE_URL + path;
    return {
      status_code: HttpStatusCode.OK,
      ok: true,
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
            ? `${fullPath}?page=${page + 1}&limit=${limit}`
            : undefined,
        prev:
          page - 1 > 0
            ? `${fullPath}?page=${page - 1}&limit=${limit}`
            : undefined,
        current: `${fullPath}?page=${page}&limit=${limit}`,
      },
    };
  }

  static formatGetOneResponse<T>(
    options: FormatSingleResponseParams<T>
  ): CommonSuccessResponse<T> {
    const { data, resource } = options;
    return {
      ok: true,
      status_code: HttpStatusCode.OK,
      status: HttpStatusCode[HttpStatusCode.OK],
      resource: resource,
      operation: "one",
      data: data,
    };
  }
  static formatCreateResponse<T>(
    options: FormatSingleResponseParams<T>
  ): SingleSuccessResponse<T> {
    const { data, resource } = options;
    return {
      ok: true,
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
      ok: true,
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
      ok: true,
      status_code: HttpStatusCode.OK,
      status: HttpStatusCode[HttpStatusCode.OK],
      resource: resource,
      operation: "delete",
      data: data,
    };
  }

  static formatCreateManyResponse<T>(
    options: FormatCreateManyResponseParams<T>
  ): CreateManySuccessResponse<T> {
    const { data, resource } = options;
    return {
      ok: true,
      status_code: HttpStatusCode.CREATED,
      status: HttpStatusCode[HttpStatusCode.CREATED],
      resource: resource,
      operation: "addMany",
      data,
    };
  }

  static formatUpdateManyResponse<T>(
    options: FormatUpdateManyResponseParams<T>
  ): UpdateManySuccessResponse<T> {
    const { data, resource } = options;
    return {
      ok: true,
      status_code: HttpStatusCode.OK,
      status: HttpStatusCode[HttpStatusCode.OK],
      resource,
      operation: "updateMany",
      data,
    };
  }
}
