import { CollaboratorRole } from "../models/Collaborator";

export const isManagerOrAdmin = (role: CollaboratorRole) => {
  return role === CollaboratorRole.manager || role === CollaboratorRole.admin;
};
