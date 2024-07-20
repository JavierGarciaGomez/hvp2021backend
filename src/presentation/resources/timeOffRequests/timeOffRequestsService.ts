import TimeOffRequestModel from "../../../infrastructure/db/mongo/models/TimeOffRequestModel";
import { CollaboratorRole, PaginationDto } from "../../../domain";
import { BaseError } from "../../../shared/errors/BaseError";
import { OldSuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { TimeOffRequestsRoutePaths } from "./timeOffRequestsRoutes";
import { TimeOffRequestDto } from "../../../domain/dtos/timeOffRequests/TimeOffRequestDto";
import { AuthenticatedCollaborator } from "../../../shared/interfaces/RequestsAndResponses";
import { ObjectId } from "mongoose";
import { getCollaboratorTimeOffOverviewDetails } from "../../../shared/helpers/timeOffHelpers";
import {
  formatDateWithoutTime,
  getEarliestDate,
} from "../../../shared/helpers/dateHelpers";
import { getActiveCollaborators } from "../../../shared/helpers/collaboratorsHelpers";
import {
  CollaboratorTimeOffOverview,
  ListSuccessResponse,
  ResourceQuery,
  TimeOffRequest,
  TimeOffStatus,
  TimeOffType,
} from "../../../shared";

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
    // todo change this
    const all = true;
    return this.fetchTimeOffRequestsLists({}, paginationDto, all);
  }

  async getTimeOffRequestsByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    // todo change this
    const all = true;
    const query = { collaborator: collaboratorId };
    return this.fetchTimeOffRequestsLists(query, paginationDto, all);
  }

  async getTimeOffRequestsByYear(
    paginationDto: PaginationDto,
    year: number
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    // todo change this
    const all = true;
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
      OldSuccessResponseFormatter.formatGetOneResponse<TimeOffRequest>({
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

    const notCancelledTimeOffRequests = dateTimeOffRequests.filter(
      (dateTimeOffRequest) =>
        dateTimeOffRequest.status !== TimeOffStatus.canceled
    );

    // TODO: Check if dates were already requested
    for (const date of timeOffRequest.requestedDays) {
      const dateOnly = formatDateWithoutTime(date);

      const pendingDatesWithoutTime = notCancelledTimeOffRequests
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
      OldSuccessResponseFormatter.fortmatCreateResponse<TimeOffRequest>({
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
    const collaboratorId = timeOffRequest.collaborator as unknown as string;

    const { remainingVacationDays, vacationsTaken, vacationsRequested } =
      await getCollaboratorTimeOffOverviewDetails(
        collaboratorId,
        firstVacationDate,
        id
      );
    const pendingOrTakenVacations = vacationsTaken.concat(vacationsRequested);
    console.log({ pendingOrTakenVacations });

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
      OldSuccessResponseFormatter.formatUpdateResponse<TimeOffRequest>({
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
      OldSuccessResponseFormatter.formatUpdateResponse<TimeOffRequest>({
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
      OldSuccessResponseFormatter.formatDeleteResponse<TimeOffRequest>({
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
      OldSuccessResponseFormatter.formatGetOneResponse<CollaboratorTimeOffOverview>(
        {
          data: overview,
          resource: "CollaboratorTimeOffOverview",
        }
      );

    return response;
  }
  async getCollaboratorsTimeOffOverview(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
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
      OldSuccessResponseFormatter.formatListResponse<CollaboratorTimeOffOverview>(
        {
          data: collaboratorsOverview,
          page: 1,
          limit: collaboratorsOverview.length,
          total: collaboratorsOverview.length,
          path: `${commonPath}${TimeOffRequestsRoutePaths.collaboratorsOverview}`,
          resource: "CollaboratorsTimeOffOverview",
        }
      );
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

      if (all || page === undefined || limit === undefined) {
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
        OldSuccessResponseFormatter.formatListResponse<TimeOffRequest>({
          data,
          page: 1,
          limit: data.length,
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
