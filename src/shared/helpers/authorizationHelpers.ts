import { WebAppRole } from "../../domain";

export const isManagerOrAdmin = (role: WebAppRole) => {
  return role === WebAppRole.manager || role === WebAppRole.admin;
};
