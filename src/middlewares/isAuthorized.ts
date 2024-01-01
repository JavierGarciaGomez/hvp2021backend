import { Model } from "mongoose";
import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";
import { Request, Response, NextFunction } from "express";
import CollaboratorModel, {
  Collaborator,
  CollaboratorRole,
} from "../models/Collaborator";
import TimeOffRequestModel from "../models/TimeOffRequestModel";
import { TimeOffRequest } from "../types/timeOffTypes";
import { ResourceCreatedBy, getResource } from "../helpers/fetchHelpers";

const isAuthorized =
  (allowedRoles: CollaboratorRole[] = []) =>
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

    if (hasAllowedRole || isCreator) {
      next(); // User is authorized, proceed to the next middleware/route handler
    } else {
      res.status(403).json({ error: "Unauthorized" });
    }
  };

export default isAuthorized;
