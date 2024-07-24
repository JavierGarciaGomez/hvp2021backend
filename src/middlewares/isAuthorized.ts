import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";
import { Response, NextFunction } from "express";
import { CollaboratorRole } from "../data/models/CollaboratorModel";
import { ResourceWithCollaborator, getResource } from "../helpers/fetchHelpers";
import { errorHandler } from "./errorHandler";
import { BaseError } from "../domain/errors/BaseError";

const isAuthorized =
  (
    allowedRoles: CollaboratorRole[] = [],
    collaboratorCanUpdate: boolean = false
  ) =>
  async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    const { role: collaboratorRole, uid } = req.authenticatedCollaborator!;
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
