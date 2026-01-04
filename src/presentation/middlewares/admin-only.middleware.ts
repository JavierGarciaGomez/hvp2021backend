import { Response, NextFunction } from "express";
import { AuthenticatedRequest } from "../../shared";
import { WebAppRole } from "../../domain";
import { Api } from "../../shared";

/**
 * Extract resource name from URL path
 */
function extractResource(url: string): string {
  const parts = url.split("/").filter(Boolean);
  const startIndex = parts[0] === "api" ? 1 : 0;
  return parts[startIndex] || "unknown";
}

/**
 * Middleware that restricts access to admin users only.
 * Must be used after AuthMiddleware.validateJWT
 */
export const adminOnlyMiddleware = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const resource = extractResource(req.originalUrl || req.url);
  const userRole = req.authUser?.role;

  if (!userRole) {
    return Api.unauthorized(res, resource, "No role found");
  }

  if (userRole !== WebAppRole.admin) {
    return Api.forbidden(res, resource, "Admin access required");
  }

  next();
};
