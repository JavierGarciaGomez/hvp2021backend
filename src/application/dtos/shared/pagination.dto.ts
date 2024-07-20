import { BaseError } from "../../../shared/errors/BaseError";

// todo I want that default pagination is all
export class PaginationDto {
  private constructor(
    public readonly page?: number,
    public readonly limit?: number
  ) {}

  static create(page?: number, limit?: number): PaginationDto {
    if ((page && isNaN(page)) || (limit && isNaN(limit))) {
      throw BaseError.badRequest("Page and Limit must be numbers");
    }

    return new PaginationDto(page, limit);
  }
}
