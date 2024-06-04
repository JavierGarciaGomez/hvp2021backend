import { Request } from "express";
import { CollaboratorRole } from "../data/models/CollaboratorModel";

export interface AuthenticatedCollaborator {
  uid: string;
  col_code: string;
  role: CollaboratorRole;
  imgUrl?: string;
}
export interface RequestWithAuthCollaborator extends Request {
  // todo remove this
  authenticatedCollaborator?: AuthenticatedCollaborator;
  authUser?: AuthenticatedCollaborator;
  reqUrl?: string;
}
