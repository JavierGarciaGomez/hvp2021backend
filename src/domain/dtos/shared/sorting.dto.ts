import { BaseError } from "../../errors/BaseError";

export class SortingDto {
  sort_by?: string;
  direction?: "ASC" | "DESC";

  // Private constructor to prevent instantiation from outside
  private constructor(sort_by?: string, direction?: "ASC" | "DESC") {
    this.sort_by = sort_by;
    this.direction = direction;
  }

  static create(sort_by?: string, direction?: string): SortingDto {
    if (direction && direction !== "ASC" && direction !== "DESC") {
      throw BaseError.badRequest("Direction must be ASC or DESC");
    }
    return new SortingDto(sort_by, direction as "ASC" | "DESC");
  }
}
