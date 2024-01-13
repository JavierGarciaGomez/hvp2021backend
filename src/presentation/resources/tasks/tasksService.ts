import { ResourceQuery } from "../../../data/types/Queries";
import TimeOffRequestModel from "../../../data/models/TimeOffRequestModel";

import { ListSuccessResponse } from "../../../data/types/responses";
import {
  TimeOffRequest,
  TimeOffStatus,
} from "../../../data/types/timeOffTypes";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";

import { AuthenticatedCollaborator } from "../../../types/RequestsAndResponses";
import { ObjectId } from "mongoose";
import { CollaboratorRole } from "../../../models/Collaborator";
import { getCollaboratorTimeOffOverviewDetails } from "../../../helpers/timeOffHelpers";
import { getEarliestDate } from "../../../helpers/dateHelpers";
import { getActiveCollaborators } from "../../../helpers/collaboratorsHelpers";
import { CollaboratorTimeOffOverview } from "../../../data/types/timeOffTypes";
import { TasksPaths } from "./tasksRoutes";
import { TaskDto } from "../../../domain/dtos/tasks/TaskDto";
import TaskModel from "../../../data/models/TaskModel";
import { Task, TaskActivity } from "../../../data/types/taskTypes";
import TaskActivityModel from "../../../data/models/TaskActivityModel";

const commonPath = "/api/time-off-requests";
const resource = "TimeOffRequests";
export class TasksService {
  // DI
  constructor() {}

  async getTasks(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    const { all } = paginationDto;
    return this.fetchLists({}, paginationDto, all);
  }

  async getTaksByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<TimeOffRequest>> {
    const { all } = paginationDto;
    const query = { collaborator: collaboratorId };
    return this.fetchLists(query, paginationDto, all);
  }

  async getTaskById(id: string) {}

  async createTask(
    taskDto: TaskDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    const activityIds = taskDto.data.activities?.map(
      (activity: TaskActivity) => {
        const newActivity = new TaskActivityModel(activity);
        newActivity.save();
        return newActivity._id;
      }
    );

    console.log({ taskdto: taskDto.data, activityIds });

    const task = new TaskModel({
      ...taskDto.data,
      activities: activityIds,
      createdBy: uid as unknown as ObjectId,
    });

    console.log({ task });

    const savedTask = await task.save();
    const populatedTask = await TaskModel.populate(savedTask, {
      path: "activities",
    });

    const response = SuccessResponseFormatter.fortmatCreateResponse<Task>({
      data: populatedTask,
      resource,
    });

    return response;
  }

  async updateTask(
    id: string,
    timeOffRequestDto: TaskDto,
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

  async deleteTask(id: string) {
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
  async getCollaboratorTaskOverview(collaboratorId: string, endDate: Date) {
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
  async getCollaboratorsTaskOverview(paginationDto: PaginationDto) {
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
        path: `${commonPath}${TasksPaths.collaboratorsOverview}`,
        resource: "CollaboratorsTimeOffOverview",
      });
    return response;
  }

  private async fetchLists(
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
          path: `${commonPath}${TasksPaths.all}`,
          resource: "TimeOffRequests",
        });

      return response;
    } catch (error) {
      throw BaseError.internalServer("Internal Server Error");
    }
  }
}
