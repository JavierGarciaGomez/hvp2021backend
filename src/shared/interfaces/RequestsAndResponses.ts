import { Request } from "express";
import { CollaboratorRole } from "../../domain";

export interface AuthenticatedCollaborator {
  uid: string;
  col_code: string;
  role: CollaboratorRole;
  imgUrl?: string;
}
export interface AuthenticatedRequest extends Request {
  // todo remove this
  authenticatedCollaborator?: AuthenticatedCollaborator;
  authUser?: AuthenticatedCollaborator;
  reqUrl?: string;
}
