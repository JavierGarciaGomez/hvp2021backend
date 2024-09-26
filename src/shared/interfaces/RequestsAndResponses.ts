import { Request } from "express";
import { WebAppRole } from "../../domain";

export interface AuthenticatedCollaborator {
  uid: string;
  col_code: string;
  role: WebAppRole;
  imgUrl?: string;
}
export interface AuthenticatedRequest extends Request {
  // todo remove this
  authenticatedCollaborator?: AuthenticatedCollaborator;
  authUser?: AuthenticatedCollaborator;
  reqUrl?: string;
}
