import { BaseError } from "../../../shared/errors/BaseError";
import { isValidEmail } from "../../../shared/helpers";

interface Options {
  email: string;
  password: string;
  col_code: string;
  access_code: string;
}

export class CollaboratorRegisterDto {
  private constructor(public readonly data: Readonly<Options>) {}
  static register(data: Options): CollaboratorRegisterDto {
    const { email, password, col_code, access_code } = data;
    if (!email || !password) {
      throw BaseError.badRequest("Email and password are required");
    }
    if (!isValidEmail(email)) {
      throw BaseError.badRequest("Invalid email");
    }
    if (password.length < 5) {
      throw BaseError.badRequest("Password must have at least 5 characters");
    }
    if (!col_code || !access_code) {
      throw BaseError.badRequest(
        "Colaborator code and access code are required"
      );
    }

    return new CollaboratorRegisterDto(data);
  }
}
