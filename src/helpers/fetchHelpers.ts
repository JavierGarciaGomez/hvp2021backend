import TimeOffRequestModel from "../data/models/TimeOffRequestModel";
import CollaboratorModel from "../models/Collaborator";

export interface ResourceWithCollaborator {
  createdBy: string; // Change the type of createdBy according to your actual data type
  collaborator: string;
}

export const getResource = async (
  baseUrl: string,
  resourceId: string
): Promise<ResourceWithCollaborator> => {
  try {
    switch (baseUrl) {
      case "/api/time-off-requests":
        return (await TimeOffRequestModel.findById(
          resourceId
        )) as ResourceWithCollaborator;

      // Add more cases for other routes
      default:
        return (await CollaboratorModel.findById(
          resourceId
        )) as ResourceWithCollaborator;
    }
  } catch (error) {
    throw new Error(
      (error as Error).message || `An error occurred while fetching `
    );
  }
};
