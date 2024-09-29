import { AuthenticatedRequest, BaseError } from "../../shared";
import { Response, NextFunction } from "express";
import { WebAppRole } from "../../domain";

export const authorizedRolesMiddleware =
  (authorizedRoles: WebAppRole[]) =>
  (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    console.log({ authUser: req });
    const userRole = req.authUser?.role;
    console.log(req.authUser);
    console.log(authorizedRoles);

    if (!userRole) {
      return res.status(401).json({ message: "Unauthorized: No role found" });
    }

    if (authorizedRoles.includes(userRole)) {
      return next();
    }

    res.status(403).json({ message: "Forbidden: Insufficient role" });
  };
