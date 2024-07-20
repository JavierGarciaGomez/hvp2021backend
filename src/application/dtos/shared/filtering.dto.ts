import { BaseError } from "../../../shared/errors/BaseError";

export class FilteringDto {
  [key: string]: string | undefined;

  static create(params: { [key: string]: string }): FilteringDto {
    const instance = new FilteringDto();

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        instance[key] = params[key];
      }
    }

    if (instance.created_at && isNaN(Date.parse(instance.created_at))) {
      throw BaseError.badRequest("Invalid date format for created_at");
    }

    if (instance.updated_at && isNaN(Date.parse(instance.updated_at))) {
      throw BaseError.badRequest("Invalid date format for updated_at");
    }

    return instance;
  }
}
