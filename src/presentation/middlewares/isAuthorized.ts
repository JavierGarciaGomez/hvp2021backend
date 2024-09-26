import { Response, NextFunction } from "express";
import { errorHandler } from "./errorHandler";
import { WebAppRole } from "../../domain";
import { AuthenticatedRequest, BaseError } from "../../shared";
import { ResourceWithCollaborator, getResource } from "../../shared/helpers";

const isAuthorized =
  (allowedRoles: WebAppRole[] = [], collaboratorCanUpdate: boolean = false) =>
  async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const { role: collaboratorRole, uid } = req.authUser!;
    const id = req.params.id;

    const resource: ResourceWithCollaborator = await getResource(
      req.baseUrl,
      id
    );

    if (!resource) {
      const error = BaseError.notFound(`Resource not found with id ${id}`);
      errorHandler(error, req, res, next);
    }

    const hasAllowedRole = allowedRoles.includes(collaboratorRole);

    const isCollaborator =
      collaboratorCanUpdate && resource!.collaborator.toString() === uid;

    if (hasAllowedRole || (isCollaborator && collaboratorCanUpdate)) {
      next();
    } else {
      const error = BaseError.unauthorized(
        "You are not authorized to perform this action"
      );
      errorHandler(error, req, res, next);
    }
  };

export default isAuthorized;
