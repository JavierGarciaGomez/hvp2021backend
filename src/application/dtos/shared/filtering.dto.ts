import { BaseError } from "../../../shared/errors/BaseError";

export class FilteringDto {
  [key: string]: any;
  // [key: string]: string | undefined;

  static create(params: { [key: string]: string }): FilteringDto {
    const instance = new FilteringDto();

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key.startsWith("$")) {
          const field = key.substring(1);
          const colonIndex = params[key].indexOf(":");
          const operator = params[key].substring(0, colonIndex);
          const value = params[key].substring(colonIndex + 1).trim();

          // Parse value based on operator and expected type
          switch (operator) {
            case "$gte":
            case "$lte":
            case "$eq":
              const dateValue = new Date(value);
              if (!isNaN(dateValue.getTime())) {
                instance[field] = { ...instance[field], [operator]: dateValue };
              } else if (!isNaN(Number(value))) {
                instance[field] = {
                  ...instance[field],
                  [operator]: Number(value),
                };
              } else {
                instance[field] = { ...instance[field], [operator]: value };
              }
              break;
            case "$regex":
              instance[field] = { $regex: value, $options: "i" };
              break;
            default:
              throw BaseError.badRequest(`Invalid operator ${operator}`);
          }
        } else {
          instance[key] = params[key];
        }
      }
    }

    return instance;
  }
}
