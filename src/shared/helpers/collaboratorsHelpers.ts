import { CollaboratorModel } from "../../infrastructure";

export const getActiveCollaborators = async () =>
  await CollaboratorModel.find({ isActive: true });
