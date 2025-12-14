import { CollaboratorModel } from "../../infrastructure";
import TaskModel from "../../infrastructure/db/mongo/models/TaskModel";
import TimeOffRequestModel from "../../infrastructure/db/mongo/models/time-off-request.model";

export interface ResourceWithCollaborator {
  createdBy: string; // Change the type of createdBy according to your actual data type
  collaborator: string;
  id: string;
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

      case "/api/tasks":
        return (await TaskModel.findById(
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
