import { ResourceQuery } from "../../../data/types/Queries";
import { ListSuccessResponse } from "../../../data/types/responses";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";

import { AuthenticatedCollaborator } from "../../../types/RequestsAndResponses";
import { ObjectId, Schema } from "mongoose";
import { TasksPaths } from "./tasksRoutes";
import { TaskDto } from "../../../domain/dtos/tasks/TaskDto";
import TaskModel from "../../../data/models/TaskModel";
import { Task } from "../../../data/types/taskTypes";
import TaskActivityModel from "../../../data/models/TaskActivityModel";

const commonPath = "/api/tasks";
const resourceName = "Tasks";
export class TasksService {
  // DI
  constructor() {}

  async getTasks(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<Task>> {
    const { all } = paginationDto;
    return this.fetchLists({}, paginationDto, all);
  }

  async getTaksByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<Task>> {
    const { all } = paginationDto;
    const query = { assignees: collaboratorId };
    return this.fetchLists(query, paginationDto, all);
  }

  async getTaskById(id: string) {
    const resource = await TaskModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    const response = SuccessResponseFormatter.formatGetOneResponse<Task>({
      data: resource,
      resource: resourceName,
    });

    return response;
  }

  async createTask(
    taskDto: TaskDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    const activityIds = await this.createOrUpdateActivities(taskDto);

    const task = new TaskModel({
      ...taskDto.data,
      activities: activityIds,
      createdBy: uid as unknown as ObjectId,
    });

    const savedTask = await task.save();
    const populatedTask = await TaskModel.populate(savedTask, {
      path: "activities",
    });

    const response = SuccessResponseFormatter.fortmatCreateResponse<Task>({
      data: populatedTask,
      resource: resourceName,
    });

    return response;
  }

  async updateTask(
    id: string,
    dto: TaskDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    const activityIds = await this.createOrUpdateActivities(dto);

    const resourceToUpdate = await TaskModel.findById(id);
    if (!resourceToUpdate)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

    const updatedResource = await TaskModel.findByIdAndUpdate(
      id,
      {
        ...dto.data,
        activities: activityIds,
        updatedAt: new Date(),
        updatedBy: uid,
      },
      { new: true }
    );

    const populatedResource = await TaskModel.populate(updatedResource, {
      path: "activities",
    });

    const response = SuccessResponseFormatter.formatUpdateResponse<Task>({
      data: populatedResource!,
      resource: resourceName,
    });

    return response;
  }

  async deleteTask(id: string) {
    const resource = await TaskModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

    const deletedResource = await TaskModel.findByIdAndDelete(id);
    const response = SuccessResponseFormatter.formatDeleteResponse<Task>({
      data: deletedResource!,
      resource: resourceName,
    });

    return response;
  }

  private async createOrUpdateActivities(
    taskDto: TaskDto
  ): Promise<Schema.Types.ObjectId[] | undefined> {
    const activityIds: Schema.Types.ObjectId[] = [];

    if (taskDto.data.activities) {
      for (const activity of taskDto.data.activities) {
        let existingActivity = null;

        // Check if the activity already exists based on some criteria, for example, using _id
        if (activity._id) {
          existingActivity = await TaskActivityModel.findById(activity._id);
        }

        if (existingActivity) {
          // If activity exists, update it
          existingActivity.set(activity);
          await existingActivity.save();
          activityIds.push(existingActivity._id);
        } else {
          // If activity doesn't exist, save it
          const newActivity = new TaskActivityModel(activity);
          await newActivity.save();
          activityIds.push(newActivity._id);
        }
      }
    }

    return activityIds.length > 0 ? activityIds : undefined;
  }

  private async fetchLists(
    query: ResourceQuery<Task>,
    paginationDto: PaginationDto,
    all: boolean
  ): Promise<ListSuccessResponse<Task>> {
    const { page, limit } = paginationDto;

    try {
      let data;

      if (all) {
        // If 'all' is present, fetch all resources without pagination
        data = await TaskModel.find(query);
      } else {
        // Fetch paginated time-off requests
        const [total, paginatedData] = await Promise.all([
          TaskModel.countDocuments(query),
          TaskModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit),
        ]);

        data = paginatedData;
      }

      const response = SuccessResponseFormatter.formatListResponse<Task>({
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
