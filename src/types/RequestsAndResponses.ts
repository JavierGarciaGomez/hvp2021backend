import { Request } from "express";
import { CollaboratorRole } from "../models/Collaborator";

export interface AuthenticatedCollaborator {
  uid: string;
  col_code: string;
  role: CollaboratorRole;
  imgUrl: string;
}
export interface RequestWithAuthCollaborator extends Request {
  authenticatedCollaborator?: AuthenticatedCollaborator;
}
