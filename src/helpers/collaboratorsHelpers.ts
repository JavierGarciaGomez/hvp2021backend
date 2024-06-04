import CollaboratorModel from "../data/models/CollaboratorModel";

export const getActiveCollaborators = async () =>
  await CollaboratorModel.find({ isActive: true });
