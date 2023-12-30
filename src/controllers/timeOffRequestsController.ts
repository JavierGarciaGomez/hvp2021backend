import { Request, Response } from "express";
import TimeOffRequestModel from "../models/TimeOffRequestModel";
import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";
import mongoose, { ObjectId } from "mongoose";

export const getTimeOffRequests = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const timeOffRequests = await TimeOffRequestModel.find();
  res
    .status(200)
    .json({ msg: "getTimeOffRequests", usuarios: timeOffRequests });
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
