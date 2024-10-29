import { BaseError } from "../../../shared/errors/BaseError";

export class FilteringDto {
  [key: string]: any;

  static create(params: { [key: string]: string }): FilteringDto {
    const instance = new FilteringDto();

    for (const key in params) {
      if (params.hasOwnProperty(key)) {
        if (key.startsWith("$")) {
          const field = key.substring(1);
          const colonIndex = params[key].indexOf(":");
          const operator = params[key].substring(0, colonIndex);
          const value = params[key].substring(colonIndex + 1).trim();

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
            case "$range":
              const [startDate, endDate] = value
                .split("...")
                .map((dateStr) => dateStr.trim());
              const parsedStartDate = new Date(startDate);
              const parsedEndDate = new Date(endDate);

              if (
                !isNaN(parsedStartDate.getTime()) &&
                !isNaN(parsedEndDate.getTime())
              ) {
                instance[field] = {
                  $gte: parsedStartDate,
                  $lte: parsedEndDate,
                };
              } else {
                throw BaseError.badRequest(
                  `Invalid date range format for ${field}`
                );
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
