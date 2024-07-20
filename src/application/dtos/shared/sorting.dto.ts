import { BaseError } from "../../../shared/errors/BaseError";

export class SortingDto {
  sort_by?: string;
  direction?: "asc" | "desc";

  // Private constructor to prevent instantiation from outside
  private constructor(sort_by?: string, direction?: "asc" | "desc") {
    this.sort_by = sort_by;
    this.direction = direction;
  }

  static create(sort_by?: string, direction?: string): SortingDto {
    if (sort_by !== undefined && typeof sort_by !== "string") {
      throw BaseError.badRequest("sort_by must be a string");
    }
    if (direction && direction !== "asc" && direction !== "desc") {
      throw BaseError.badRequest("Direction must be asc or desc");
    }
    return new SortingDto(sort_by, direction as "asc" | "desc");
  }
}
