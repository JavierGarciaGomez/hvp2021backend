import CollaboratorModel from "../models/Collaborator";
import TimeOffRequestModel from "../models/TimeOffRequestModel";

export interface ResourceCreatedBy {
  createdBy: string; // Change the type of createdBy according to your actual data type
}

export const getResource = async (
  baseUrl: string,
  resourceId: string
): Promise<ResourceCreatedBy> => {
  try {
    switch (baseUrl) {
      case "/api/time-off-requests":
        return (await TimeOffRequestModel.findById(
          resourceId
        )) as ResourceCreatedBy;

      // Add more cases for other routes
      default:
        return (await CollaboratorModel.findById(
          resourceId
        )) as ResourceCreatedBy;
    }
  } catch (error) {
    throw new Error(
      (error as Error).message || `An error occurred while fetching `
    );
  }
};
