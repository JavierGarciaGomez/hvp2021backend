import { CollaboratorRole } from "../../domain";

export const isManagerOrAdmin = (role: CollaboratorRole) => {
  return role === CollaboratorRole.manager || role === CollaboratorRole.admin;
};
