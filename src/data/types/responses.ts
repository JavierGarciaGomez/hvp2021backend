export interface CommonSuccessResponse<T> {
  status_code: number;
  status: string;
  resource: string;
  operation: string;
  data: T;
}

export interface ListSuccessResponse<T> extends CommonSuccessResponse<T[]> {
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

export interface SingleSuccessResponse<T> extends CommonSuccessResponse<T> {}
