import { Request, Response } from "express";
import TimeOffRequestModel from "../models/TimeOffRequestModel";
import { RequestWithAuthCollaborator } from "../types/RequestsAndResponses";
import mongoose, { ObjectId } from "mongoose";
import CollaboratorModel from "../models/Collaborator";
import {
  calculateTotalVacationDays,
  getApprovedVacations,
  getNotRejectedTimeOffsByType,
  getPendingVacations,
} from "../helpers/timeOffHelpers";
import { TimeOffType } from "../constants/AttendanceConstants";

// TODO complete all endpoints
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

// TODO continue working on this endpoint
type CollaboratorVacations = {
  totalVacationDays: number; // a) The number of vacation days the collaborator has a right to take
  vacationsTaken: Date[]; // b) Vacations taken by the collaborator (an array of dates)
  vacationsRequested: Date[]; // c) Vacations requested but not approved (an array of dates)
  remainingVacationDays: number; // d) Number of vacation days left for the collaborator
  partialPermissions: Date[];
  simulatedAbsences: Date[];
  sickLeavesIMSSUnpaid: Date[];
  sickLeavesIMSSPaid: Date[];
  sickLeavesJustifiedByCompany: Date[];
  dayLeaves: Date[];
};

export const getCollaboratorTimeOffStatus = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const collaboratorId = req.params.collaboratorId;
  const endDateParam = req.body.endDate;
  const endDate = endDateParam ? new Date(endDateParam) : new Date();

  const collaboratorTimeOffRequests = await TimeOffRequestModel.find({
    collaborator: req.params.collaboratorId,
  });
  const collaborator = await CollaboratorModel.findById(collaboratorId);

  // const vacations = calculateVacations(
  //   collaborator?.startDate!,
  //   collaboratorTimeOffRequests
  // );

  const totalVacationDays = calculateTotalVacationDays(
    collaborator?.startDate!,
    endDate
  );

  const vacationsTaken: Date[] = getApprovedVacations(
    collaboratorTimeOffRequests
  );

  const vacationsRequested: Date[] = getPendingVacations(
    collaboratorTimeOffRequests
  );

  const partialPermissions: Date[] = getNotRejectedTimeOffsByType(
    collaboratorTimeOffRequests,
    TimeOffType.partialPermission
  );

  const simulatedAbsences: Date[] = getNotRejectedTimeOffsByType(
    collaboratorTimeOffRequests,
    TimeOffType.simulatedAbsence
  );

  const sickLeavesIMSSUnpaid: Date[] = getNotRejectedTimeOffsByType(
    collaboratorTimeOffRequests,
    TimeOffType.sickLeaveIMSSUnpaid
  );

  const sickLeavesIMSSPaid: Date[] = getNotRejectedTimeOffsByType(
    collaboratorTimeOffRequests,
    TimeOffType.sickLeaveIMSSPaid
  );

  const sickLeavesJustifiedByCompany: Date[] = getNotRejectedTimeOffsByType(
    collaboratorTimeOffRequests,
    TimeOffType.sickLeaveJustifiedByCompany
  );

  const dayLeaves: Date[] = getNotRejectedTimeOffsByType(
    collaboratorTimeOffRequests,
    TimeOffType.dayLeave
  );

  const remainingVacationDays =
    totalVacationDays -
    vacationsTaken.length -
    vacationsRequested.length -
    (collaborator?.vacationsTakenBefore2021 ?? 0);
  const data: CollaboratorVacations = {
    totalVacationDays,
    vacationsTaken,
    vacationsRequested: vacationsRequested,
    remainingVacationDays,
    partialPermissions,
    simulatedAbsences,
    sickLeavesIMSSUnpaid,
    sickLeavesIMSSPaid,
    sickLeavesJustifiedByCompany,
    dayLeaves,
  };

  res.status(200).json({
    msg: "getCollaboratorVacationsStatus",
    data,
  });
};
