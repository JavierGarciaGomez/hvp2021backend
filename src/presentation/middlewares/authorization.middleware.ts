import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { AuthorizationService } from "../../application";
import { AuthenticatedRequest, BaseError } from "../../shared";
import { WebAppRole } from "../../domain";

export const authorizationMiddleware = (
  options: {
    roles?: string[];
    checkOwnership?: boolean;
    resourceModel?: mongoose.Model<any>;
  } = {}
) => {
  return async (
    req: AuthenticatedRequest,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const authenticatedCollaborator = req.authUser;
      const resourceId = req.params.id; // Assuming the resource ID is in the route parameters

      if (!authenticatedCollaborator) {
        throw BaseError.unauthorized("Unauthorized");
      }

      const { roles = [], checkOwnership = false, resourceModel } = options;

      let resource;
      if (checkOwnership && resourceModel) {
        try {
          resource = await resourceModel.findById(resourceId);
          if (!resource) {
            throw BaseError.notFound("Resource not found");
          }
        } catch (error) {
          throw BaseError.internalServer("Error fetching resource");
        }
      }

      // Check role-based access
      if (roles.length > 0) {
        const hasRole = roles.some((role) => {
          if (role === WebAppRole.admin)
            return authenticatedCollaborator.role === WebAppRole.admin;
          if (role === WebAppRole.manager)
            return authenticatedCollaborator.role === WebAppRole.manager;
          return false;
        });

        if (!hasRole) {
          throw BaseError.forbidden("Insufficient role");
        }
      }

      // Check if the user is the resource owner
      if (
        checkOwnership &&
        resource &&
        !AuthorizationService.isResourceOwner(
          authenticatedCollaborator,
          resource.collaborator
        )
      ) {
        return res
          .status(403)
          .json({ message: "Forbidden: Not the resource owner" });
      }
    } catch (error) {
      next(error);
    }

    next();
  };
};
