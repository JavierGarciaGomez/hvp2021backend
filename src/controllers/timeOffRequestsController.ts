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
import { TimeOffStatus, TimeOffType } from "../constants/AttendanceConstants";
import throwErrorResponse from "../helpers/throwErrorResponse";
import { TimeOffRequest } from "../types/timeOffTypes";

// TODO complete all endpoints
interface HandleRequestParams {
  req: RequestWithAuthCollaborator;
  res: Response;
  query: any;
  operation: string;
}
const handleRequest = async ({
  req,
  res,
  query,
  operation,
}: HandleRequestParams) => {
  try {
    const timeOffRequests = await TimeOffRequestModel.find(query);
    res.status(200).json({
      msg: operation,
      statusCode: 200,
      data: timeOffRequests,
      operation,
    });
  } catch (error) {
    throwErrorResponse({
      res,
      statusCode: 500,
      operation,
      error: error as Error,
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
    operation: "getTimeOffRequests",
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
    operation: "getTimeOffRequestsByCollaborator",
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
    operation: "getTimeOffRequestsByYear",
  });
};

export const getTimeOffRequestById = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const operationId = "getTimeOffRequestById";
  try {
    const id = req.params.id;
    const timeOffRequest = await TimeOffRequestModel.findById(id);
    if (!timeOffRequest) {
      throwErrorResponse({
        res,
        statusCode: 404,
        operation: operationId,
        error: new Error("Resource not found"),
      });
      return;
    }
    res.status(200).json({
      msg: operationId,
      statusCode: 200,
      data: timeOffRequest,
      operation: operationId,
    });
  } catch (error) {
    throwErrorResponse({
      res,
      statusCode: 500,
      operation: operationId,
      error: error as Error,
    });
  }
};

export const createTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const operationId = "createTimeOffRequest";
  try {
    const { authenticatedCollaborator } = req;
    console.log({ authenticatedCollaborator });
    const { uid } = authenticatedCollaborator!;
    const { body } = req;
    const timeOffRequest = new TimeOffRequestModel({
      ...body,
      createdBy: uid as unknown as ObjectId,
      updatedBy: uid as unknown as ObjectId,
    });

    const savedTimeOffRequest = await timeOffRequest.save();
    res.status(200).json({
      msg: operationId,
      statusCode: 200,
      data: savedTimeOffRequest,
      operation: operationId,
    });
  } catch (error) {
    throwErrorResponse({
      res,
      statusCode: 500,
      operation: operationId,
      error: error as Error,
    });
  }
};

export const updateTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const operationId = "updateTimeOffRequest";
  try {
    const id = req.params.id;
    const { role, uid } = req.authenticatedCollaborator!;
    const updateData = req.body as TimeOffRequest;

    const timeOffRequest = await TimeOffRequestModel.findById(id);
    if (!timeOffRequest) {
      throwErrorResponse({
        res,
        statusCode: 404,
        operation: operationId,
        error: new Error("Resource not found"),
      });
      return;
    }

    updateData.updatedBy = uid as unknown as ObjectId;
    updateData.updatedAt = new Date();
    const updatedResource = await TimeOffRequestModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    res.status(200).json({
      msg: operationId,
      statusCode: 200,
      data: updatedResource,
      operation: operationId,
    });
  } catch (error) {
    throwErrorResponse({
      res,
      statusCode: 500,
      operation: operationId,
      error: error as Error,
    });
  }
};

export const approveTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const operationId = "approveTimeOffRequest";
  try {
    const id = req.params.id;
    const { uid } = req.authenticatedCollaborator!;
    const updateData = req.body as TimeOffRequest;

    const timeOffRequest = await TimeOffRequestModel.findById(id);
    if (!timeOffRequest) {
      throwErrorResponse({
        res,
        statusCode: 404,
        operation: operationId,
        error: new Error("Resource not found"),
      });
      return;
    }

    // Update only the status field to "sent"
    const updatedResource = await TimeOffRequestModel.findByIdAndUpdate(
      id,
      {
        status: updateData.status,
        updatedBy: uid as unknown as ObjectId,
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({
      msg: operationId,
      statusCode: 200,
      data: updatedResource,
      operation: operationId,
    });
  } catch (error) {
    throwErrorResponse({
      res,
      statusCode: 500,
      operation: operationId,
      error: error as Error,
    });
  }
};

export const deleteTimeOffRequest = async (
  req: RequestWithAuthCollaborator,
  res: Response
) => {
  const operationId = "deleteTimeOffRequest";
  try {
    const id = req.params.id;

    const timeOffRequest = await TimeOffRequestModel.findById(id);
    if (!timeOffRequest) {
      throwErrorResponse({
        res,
        statusCode: 404,
        operation: operationId,
        error: new Error("Resource not found"),
      });
      return;
    }

    if (
      timeOffRequest.status === TimeOffStatus.approved ||
      timeOffRequest.status === TimeOffStatus.rejected
    ) {
      throwErrorResponse({
        res,
        statusCode: 400,
        operation: operationId,
        error: new Error(
          "Cannot delete approved or rejected time off requests"
        ),
      });
      return;
    }

    await TimeOffRequestModel.findByIdAndDelete(id);

    res.status(200).json({
      msg: operationId,
      statusCode: 200,
      data: { id },
      operation: operationId,
    });
  } catch (error) {
    throwErrorResponse({
      res,
      statusCode: 500,
      operation: operationId,
      error: error as Error,
    });
  }
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
  try {
    const collaboratorId = req.params.collaboratorId;
    const endDateParam = req.body.endDate;
    const endDate = endDateParam ? new Date(endDateParam) : new Date();

    const collaboratorTimeOffRequests = await TimeOffRequestModel.find({
      collaborator: req.params.collaboratorId,
    });
    const collaborator = await CollaboratorModel.findById(collaboratorId);

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
      statusCode: 200,
      data,
    });
  } catch (error) {
    throwErrorResponse({
      res,
      statusCode: 500,
      operation: "getCollaboratorVacationsStatus",
      error: error as Error,
    });
  }
};
