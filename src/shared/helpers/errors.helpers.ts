import { BaseError } from "../errors";

export const checkForErrors = (errors: string[]) => {
  if (errors.length) {
    throw BaseError.badRequest("Bad Request", errors.join(", "));
  }
};
