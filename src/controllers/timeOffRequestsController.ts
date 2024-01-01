import { Request, Response } from "express";
import TimeOffRequestModel from "../models/TimeOffRequestModel";
import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";
import mongoose, { ObjectId } from "mongoose";
import CollaboratorModel from "../models/Collaborator";
import { calculateVacations } from "../helpers/timeOffHelpers";

interface HandleRequestParams {
  req: RequestWithAuthCollaborator;
  res: Response;
  query: any;
  successMessage: string;
}
const handleRequest = async ({
  req,
  res,
  query,
  successMessage,
}: HandleRequestParams) => {
  try {
    const timeOffRequests = await TimeOffRequestModel.find(query);
    res.status(200).json({
      msg: successMessage,
      statusCode: 200,
      data: timeOffRequests,
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({
      msg: "Internal Server Error",
      statusCode: 500,
      error:
        (error as Error).message ||
        `An error occurred while fetching ${successMessage.toLowerCase()}.`,
    });
  }
};

export const getTimeOffRequests = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  await handleRequest({
    req,
    res,
    query: {},
    successMessage: "getTimeOffRequests",
  });
};

export const getTimeOffRequestsByCollaborator = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const collaboratorId = req.params.collaboratorId;
  await handleRequest({
    req,
    res,
    query: { collaborator: collaboratorId },
    successMessage: "getTimeOffRequestsByCollaborator",
  });
};

export const getTimeOffRequestsByYear = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const year = req.params.year;
  await handleRequest({
    req,
    res,
    query: {
      requestedDays: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    },
    successMessage: "getTimeOffRequestsByYear",
  });
};

export const getTimeOffRequestById = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  res.status(200).json({ msg: "getTimeOffRequestById" });
};

export const createTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const { authenticatedCollaborator } = req;
  console.log({ authenticatedCollaborator });
  const { uid } = authenticatedCollaborator!;
  const { body } = req;
  const timeOffRequest = new TimeOffRequestModel({
    ...body,
    createdBy: uid as unknown as ObjectId,
    updatedBy: uid as unknown as ObjectId,
  });

  await timeOffRequest.save();
  res.status(200).json({ msg: "createTimeOffRequest", timeOffRequest });
};

export const updateTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  res.status(200).json({ msg: "updateTimeOffRequest" });
};

export const approveTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  res.status(200).json({ msg: "approveTimeOffRequest" });
};

export const deleteTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  res.status(200).json({ msg: "deleteTimeOffRequest" });
};

export const getCollaboratorVacationsStatus = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const collaboratorId = req.params.collaboratorId;
  const collaboratorTimeOffRequests = await TimeOffRequestModel.find({
    collaborator: req.params.collaboratorId,
  });
  const collaborator = await CollaboratorModel.findById(collaboratorId);

  const vacations = calculateVacations(
    collaborator?.startDate!,
    collaboratorTimeOffRequests
  );

  res.status(200).json({
    msg: "getCollaboratorVacationsStatus",
    data: { collaboratorTimeOffRequests, collaborator, vacations },
  });
};
