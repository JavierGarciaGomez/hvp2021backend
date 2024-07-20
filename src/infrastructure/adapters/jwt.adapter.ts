import { BaseError } from "../../shared";
import { envsPlugin } from "./envs.plugin";
import jwt from "jsonwebtoken";

const JWT_SEED = envsPlugin.SECRET_JWT_SEED;

export class JwtAdapter {
  // DI?

  static async generateToken(
    payload: any,
    duration: string = "7d"
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      jwt.sign(payload, JWT_SEED, { expiresIn: duration }, (err, token) => {
        if (err || !token) {
          reject(BaseError.internalServer("Error generating token"));
        } else {
          resolve(token);
        }
      });
    });
  }

  static verifyToken<T>(token: string): Promise<T> {
    return new Promise((resolve, reject) => {
      jwt.verify(token, JWT_SEED, (err, decoded) => {
        if (err) {
          reject(err); // Reject the promise with the error
        } else {
          resolve(decoded as T);
        }
      });
    });
  }
}
