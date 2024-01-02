import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";
import { Response, NextFunction } from "express";
import { CollaboratorRole } from "../models/Collaborator";
import { ResourceCreatedBy, getResource } from "../helpers/fetchHelpers";

const isAuthorized =
  (allowedRoles: CollaboratorRole[] = [], creatorCanUpdate: boolean = false) =>
  async (
    req: RequestWithAuthCollaborator,
    res: Response,
    next: NextFunction
  ) => {
    const { role: collaboratorRole, uid } = req.authenticatedCollaborator!;
    const id = req.params.id;

    const resource: ResourceCreatedBy = await getResource(req.baseUrl, id);

    if (!resource) {
      return res.status(404).json({ error: "Resource not found" });
    }

    const hasAllowedRole = allowedRoles.includes(collaboratorRole);

    const isCreator = resource!.createdBy.toString() === uid;

    if (hasAllowedRole || (isCreator && creatorCanUpdate)) {
      next();
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  };

export default isAuthorized;
