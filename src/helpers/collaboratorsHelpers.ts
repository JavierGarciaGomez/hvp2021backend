import CollaboratorModel from "../models/Collaborator";

export const getActiveCollaborators = async () =>
  await CollaboratorModel.find({ isActive: true });
