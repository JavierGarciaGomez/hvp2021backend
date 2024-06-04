import { CollaboratorRole } from "../data/models/CollaboratorModel";

export const isManagerOrAdmin = (role: CollaboratorRole) => {
  return role === CollaboratorRole.manager || role === CollaboratorRole.admin;
};
