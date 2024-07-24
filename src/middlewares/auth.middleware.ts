import { NextFunction, Request, Response } from "express";
import { JwtAdapter } from "../config";
import CollaboratorModel from "../data/models/CollaboratorModel";
import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";

export class AuthMiddleware {
  static async validateJWT(
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) {
    const authorization = req.header("Authorization");
    if (!authorization)
      return res.status(401).json({ error: "No token provided" });
    if (!authorization.startsWith("Bearer "))
      return res.status(401).json({ error: "Invalid Bearer token" });

    const token = authorization.split(" ").at(1) || "";

    try {
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
      console.log(error);
      res.status(500).json({ error: "Internal server error" });
    }
  }
}
