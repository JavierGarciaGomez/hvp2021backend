import { NextFunction, Request, Response } from "express";
import { AuthenticatedRequest, BaseError } from "../../shared";
import { JwtAdapter } from "../../infrastructure/adapters";
import { CollaboratorModel } from "../../infrastructure";

export class AuthMiddleware {
  static async validateJWT(
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) {
    try {
      const authorization = req.header("Authorization");
      if (!authorization)
        throw BaseError.unauthorized("Authorization header not found");
      if (!authorization.startsWith("Bearer "))
        return BaseError.unauthorized("Invalid token format");

      const token = authorization.split(" ").at(1) || "";
      const payload = await JwtAdapter.verifyToken<{ uid: string }>(token);
      if (!payload) return res.status(401).json({ error: "Invalid token" });

      const user = await CollaboratorModel.findById(payload.uid);
      if (!user) return res.status(401).json({ error: "Invalid token - user" });

      // todo: validar si el usuario está activo

      req.authUser = {
        uid: user._id,
        col_code: user.col_code,
        role: user.role,
        imgUrl: user.imgUrl,
      };

      next();
    } catch (error) {
      next(error);
    }
  }
}
