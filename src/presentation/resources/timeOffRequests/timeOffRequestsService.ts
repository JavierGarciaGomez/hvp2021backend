import { ResourceQuery } from "./../../../data/types/Queries";
import TimeOffRequestModel from "../../../data/models/TimeOffRequestModel";

import { ListSuccessResponse } from "../../../data/types/responses";
import {
  TimeOffRequest,
  TimeOffStatus,
  TimeOffType,
} from "../../../data/types/timeOffTypes";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { TimeOffRequestsRoutePaths } from "./timeOffRequestsRoutes";
import { TimeOffRequestDto } from "../../../domain/dtos/timeOffRequests/TimeOffRequestDto";
import { AuthenticatedCollaborator } from "../../../types/RequestsAndResponses";
import { ObjectId } from "mongoose";
import { CollaboratorRole } from "../../../models/Collaborator";
import { getCollaboratorTimeOffOverviewDetails } from "../../../helpers/timeOffHelpers";
import {
  formatDateWithoutTime,
  getEarliestDate,
} from "../../../helpers/dateHelpers";
import { getActiveCollaborators } from "../../../helpers/collaboratorsHelpers";
import { CollaboratorTimeOffOverview } from "../../../data/types/timeOffTypes";

// import {
//   CreateCategoryDto,
//   CustomError,
//   PaginationDto,
//   UserEntity,
// } from "../../domain";

const commonPath = "/api/time-off-requests";
const resource = "TimeOffRequests";
export class TimeOffRequestsService {
  // DI
  constructor() {}

  async getTimeOffRequests(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    const { all } = paginationDto;
    return this.fetchTimeOffRequestsLists({}, paginationDto, all);
  }

  async getTimeOffRequestsByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    const { all } = paginationDto;
    const query = { collaborator: collaboratorId };
    return this.fetchTimeOffRequestsLists(query, paginationDto, all);
  }

  async getTimeOffRequestsByYear(
    paginationDto: PaginationDto,
    year: number
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    const { all } = paginationDto;
    const query = {
      requestedDays: {
        $gte: new Date(`${year}-01-01`),
        $lte: new Date(`${year}-12-31`),
      },
    };

    return this.fetchTimeOffRequestsLists(query, paginationDto, all);
  }

  async getTimeOffRequestById(id: string) {
    const timeOffRequest = await TimeOffRequestModel.findById(id);
    if (!timeOffRequest)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    const response =
      SuccessResponseFormatter.formatGetOneResponse<TimeOffRequest>({
        data: timeOffRequest,
        resource,
      });

    return response;
  }

  async createTimeOffRequest(
    timeOffRequestDto: TimeOffRequestDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    const timeOffRequest = new TimeOffRequestModel({
      ...timeOffRequestDto.data,
      createdBy: uid as unknown as ObjectId,
    });

    const firstTimeOffDate = getEarliestDate(timeOffRequest.requestedDays);
    const vacationsDaysRequested = timeOffRequest.requestedDays.length;

    const { remainingVacationDays, dateTimeOffRequests } =
      await getCollaboratorTimeOffOverviewDetails(uid, firstTimeOffDate);

    // TODO: Check if dates were already requested
    for (const date of timeOffRequest.requestedDays) {
      const dateOnly = formatDateWithoutTime(date);

      const pendingDatesWithoutTime = dateTimeOffRequests
        .map((dateTimeOffRequest) => dateTimeOffRequest.date)
        .map(formatDateWithoutTime);

      if (pendingDatesWithoutTime.includes(dateOnly)) {
        throw BaseError.badRequest(
          `The collaborator already has a time off request for the date ${dateOnly}.`
        );
      }
    }
    // Todo check if he has enough days

    if (
      timeOffRequest.timeOffType === TimeOffType.vacation &&
      remainingVacationDays < vacationsDaysRequested
    ) {
      throw BaseError.badRequest(
        `The collaborator has ${remainingVacationDays} vacations days for the ${firstTimeOffDate.toISOString()}.`
      );
    }
    const savedTimeOffRequest = await timeOffRequest.save();

    const response =
      SuccessResponseFormatter.fortmatCreateResponse<TimeOffRequest>({
        data: savedTimeOffRequest,
        resource,
      });

    return response;
  }

  async updateTimeOffRequest(
    id: string,
    timeOffRequestDto: TimeOffRequestDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid, role } = authenticatedCollaborator;

    const timeOffRequest = await TimeOffRequestModel.findById(id);
    if (!timeOffRequest)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    if (
      timeOffRequest.status !== TimeOffStatus.pending &&
      role !== CollaboratorRole.admin &&
      role !== CollaboratorRole.manager
    ) {
      throw BaseError.unauthorized(
        "The time off request has already been approved."
      );
    }

    const firstVacationDate = getEarliestDate(timeOffRequest.requestedDays);
    const vacationsDaysRequested = timeOffRequest.requestedDays.length;

    const { remainingVacationDays, vacationsTaken, vacationsRequested } =
      await getCollaboratorTimeOffOverviewDetails(uid, firstVacationDate, id);
    const pendingOrTakenVacations = vacationsTaken.concat(vacationsRequested);

    // TODO: Check if dates were already requested
    for (const date of timeOffRequestDto.data.requestedDays) {
      const dateOnly = formatDateWithoutTime(new Date(date));

      const pendingDatesWithoutTime = pendingOrTakenVacations.map(
        formatDateWithoutTime
      );

      if (pendingDatesWithoutTime.includes(dateOnly)) {
        throw BaseError.badRequest(
          `The collaborator already has a time off request for the date ${dateOnly}.`
        );
      }
    }
    // Todo check if he has enough days

    if (remainingVacationDays < vacationsDaysRequested) {
      throw BaseError.badRequest(
        `The collaborator has ${remainingVacationDays} vacations days for the ${firstVacationDate.toISOString()}.`
      );
    }

    const updatedResource = await TimeOffRequestModel.findByIdAndUpdate(
      id,
      { ...timeOffRequestDto.data, updatedAt: new Date(), updatedBy: uid },
      { new: true }
    );

    const response =
      SuccessResponseFormatter.formatUpdateResponse<TimeOffRequest>({
        data: updatedResource!,
        resource,
      });

    return response;
  }
  async approveTimeOffRequest(
    { approvedBy, managerNote, status }: Partial<TimeOffRequest>,
    id: string
  ) {
    const updatedResource = await TimeOffRequestModel.findByIdAndUpdate(
      id,
      {
        approvedBy,
        managerNote,
        status,
        approvedAt: new Date(),
        updatedAt: new Date(),
      },
      { new: true }
    );
    const response =
      SuccessResponseFormatter.formatUpdateResponse<TimeOffRequest>({
        data: updatedResource!,
        resource,
      });

    return response;
  }
  async deleteTimeOffRequest(id: string) {
    const timeOffRequest = await TimeOffRequestModel.findById(id);
    if (!timeOffRequest)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    if (timeOffRequest.status !== TimeOffStatus.pending) {
      throw BaseError.badRequest(
        `The time off request has already been approved/rejected.`
      );
    }

    const deletedResource = await TimeOffRequestModel.findByIdAndDelete(id);
    const response =
      SuccessResponseFormatter.formatDeleteResponse<TimeOffRequest>({
        data: deletedResource!,
        resource,
      });

    return response;
  }
  async getCollaboratorTimeOffOverview(collaboratorId: string, endDate: Date) {
    const overview = await getCollaboratorTimeOffOverviewDetails(
      collaboratorId,
      endDate
    );

    const response =
      SuccessResponseFormatter.formatGetOneResponse<CollaboratorTimeOffOverview>(
        {
          data: overview,
          resource: "CollaboratorTimeOffOverview",
        }
      );

    return response;
  }
  async getCollaboratorsTimeOffOverview(paginationDto: PaginationDto) {
    const { all, page, limit } = paginationDto;
    const activeCollaborators = await getActiveCollaborators();
    const collaboratorsOverview: CollaboratorTimeOffOverview[] = [];
    for (const collaborator of activeCollaborators) {
      const collaboratorId = collaborator._id; // Adjust this based on your collaborator data structure

      // Use the getCollaboratorTimeOffOverview function to get the time-off overview for the current collaborator
      const overview = await getCollaboratorTimeOffOverviewDetails(
        collaboratorId
      );

      // Add the collaborator's time-off overview to the array
      collaboratorsOverview.push(overview);
    }
    const response =
      SuccessResponseFormatter.formatListResponse<CollaboratorTimeOffOverview>({
        data: collaboratorsOverview,
        page,
        limit,
        total: collaboratorsOverview.length,
        path: `${commonPath}${TimeOffRequestsRoutePaths.collaboratorsOverview}`,
        resource: "CollaboratorsTimeOffOverview",
      });
    return response;
  }

  private async fetchTimeOffRequestsLists(
    query: ResourceQuery<TimeOffRequest>,
    paginationDto: PaginationDto,
    all: boolean
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    const { page, limit } = paginationDto;

    try {
      let data;

      if (all) {
        // If 'all' is present, fetch all resources without pagination
        data = await TimeOffRequestModel.find(query);
      } else {
        // Fetch paginated time-off requests
        const [total, paginatedData] = await Promise.all([
          TimeOffRequestModel.countDocuments(query),
          TimeOffRequestModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit),
        ]);

        data = paginatedData;
      }

      const response =
        SuccessResponseFormatter.formatListResponse<TimeOffRequest>({
          data,
          page,
          limit,
          total: data.length,
          path: `${commonPath}${TimeOffRequestsRoutePaths.all}`,
          resource: "TimeOffRequests",
        });

      return response;
    } catch (error) {
      throw BaseError.internalServer("Internal Server Error");
    }
  }
}