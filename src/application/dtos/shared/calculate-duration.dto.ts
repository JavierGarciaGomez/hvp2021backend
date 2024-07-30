import { start } from "repl";
import { BaseError } from "../../../shared/errors/BaseError";

// todo I want that default pagination is all
export class calculateDurationDTO {
  private constructor(
    public readonly startDate?: Date,
    public readonly endDate?: Date
  ) {}

  static create(startDate?: string, endDate?: string): calculateDurationDTO {
    if (startDate && isNaN(Date.parse(startDate))) {
      throw BaseError.badRequest("Invalid date format for startDate");
    }
    if (endDate && isNaN(Date.parse(endDate))) {
      throw BaseError.badRequest("Invalid date format for endDate");
    }

    return new calculateDurationDTO(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }
}
