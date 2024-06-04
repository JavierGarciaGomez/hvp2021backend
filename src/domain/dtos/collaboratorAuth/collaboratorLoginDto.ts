import { register } from "module";
import { isValidEmail } from "../../../helpers";
import { BaseError } from "../../errors/BaseError";

interface LoginOptions {
  email: string;
  password: string;
}

export class CollaboratorLoginDto {
  private constructor(public readonly data: Readonly<LoginOptions>) {}
  static login(data: LoginOptions): CollaboratorLoginDto {
    const { email, password } = data;
    if (!email || !password) {
      throw BaseError.badRequest("Email and password are required");
    }
    if (!isValidEmail(email)) {
      throw BaseError.badRequest("Invalid email");
    }
    if (password.length < 5) {
      throw BaseError.badRequest("Password must have at least 5 characters");
    }

    return new CollaboratorLoginDto(data);
  }
}
