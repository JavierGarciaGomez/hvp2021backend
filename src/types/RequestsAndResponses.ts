import { Request } from "express";

interface AuthenticatedCollaborator {
  uid: string;
  col_code: string;
  role: string;
  imgUrl: string;
}
export interface RequestWithAuthCollaborator extends Request {
  authenticatedCollaborator?: AuthenticatedCollaborator;
}
