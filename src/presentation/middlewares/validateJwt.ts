import { JwtAdapter } from "../../infrastructure/adapters";
import {
  AuthenticatedCollaborator,
  AuthenticatedRequest,
} from "./../../shared/interfaces/RequestsAndResponses";
import { NextFunction, Response } from "express";

export const validateJwt = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  try {
    // x-token headers
    const token = req.header("x-token");
    console.log({ token });
    if (!token) {
      return res.status(401).json({
        ok: false,
        msg: "No hay token en la petición",
      });
    }
    const payload = await JwtAdapter.verifyToken<AuthenticatedCollaborator>(
      token
    );

    const { uid, col_code, role, imgUrl } = payload;

    req.authenticatedCollaborator = {
      uid,
      col_code,
      role,
      imgUrl,
    };

    // req.uid = uid;
    // req.col_code = col_code;
    // req.role = role;
    // req.imgUrl = imgUrl;
  } catch (error) {
    // console.log("ERROR", error.message);
    return res.status(401).json({
      ok: false,
      msg: "Token no válido",
    });
  }

  next();
};

module.exports = {
  validateJwt,
};
