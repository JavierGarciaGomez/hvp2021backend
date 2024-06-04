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
import { isManagerOrAdmin } from "../../../helpers/authorizationHelpers";
import { fetchList } from "../../../helpers";

const commonPath = "/api/tasks";
const resourceName = "Tasks";
export class TasksService {
  // DI
  constructor() {}

  async getTasks(
    paginationDto: PaginationDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ): Promise<ListSuccessResponse<Task>> {
    const { role } = authenticatedCollaborator;
    const hasAccessRole = isManagerOrAdmin(role);
    const query: ResourceQuery<Task> = {};
    if (!hasAccessRole) {
      query["isRestrictedView"] = false;
    }

    return fetchList({
      model: TaskModel,
      query,
      paginationDto,
      path: `${commonPath}`,
      resourceName: "Tasks",
    });
  }

  async getTaksByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<Task>> {
    const query = { assignees: collaboratorId };
    return fetchList({
      model: TaskModel,
      query,
      paginationDto,
      path: `${commonPath}/collaborator/${collaboratorId}`,
      resourceName: "Tasks",
    });
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

    const activityIds = await this.createOrUpdateActivities(taskDto, uid);

    const task = new TaskModel({
      ...taskDto.data,
      activities: activityIds,
      createdBy: uid as unknown as ObjectId,
      updatedBy: uid as unknown as ObjectId,
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

    const activityIds = await this.createOrUpdateActivities(dto, uid);

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
    taskDto: TaskDto,
    uid: string
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
          existingActivity.set({ ...activity, createdBy: uid, updatedBy: uid });
          await existingActivity.save();
          activityIds.push(existingActivity._id);
        } else {
          // If activity doesn't exist, save it
          const newActivity = new TaskActivityModel({
            ...activity,
            createdBy:
              (activity.createdBy as unknown as string) !== ""
                ? activity.createdBy
                : uid,
            updatedBy: uid,
            updatedAt: new Date(),
          });
          await newActivity.save();
          activityIds.push(newActivity._id);
        }
      }
    }

    return activityIds.length > 0 ? activityIds : undefined;
  }
}
