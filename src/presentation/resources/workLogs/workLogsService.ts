import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../shared/errors/BaseError";
import { OldSuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { AuthenticatedCollaborator } from "../../../shared/interfaces/RequestsAndResponses";
import { WorkLogDto } from "../../../domain/dtos/workLogs/WorkLogDto";
import TaskActivityModel from "../../../infrastructure/db/mongo/models/TaskActivityModel";
import WorkLogModel from "../../../infrastructure/db/mongo/models/WorkLogModel";
import TaskModel from "../../../infrastructure/db/mongo/models/TaskModel";
import { ListSuccessResponse, WorkLog, WorkLogActivity } from "../../../shared";
import { fetchList } from "../../../shared/helpers";
import { ObjectId } from "mongoose";

const commonPath = "/api/work-logs";
const resourceName = "WorkLogs";
export class WorkLogsService {
  // DI
  constructor() {}

  async getWorkLogs(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<WorkLog>> {
    return fetchList({
      model: WorkLogModel,
      query: {},
      paginationDto,
      path: `${commonPath}`,
      resourceName: "WorkLogs",
    });
  }

  async getWorkLogsByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<WorkLog>> {
    const query = { createdBy: collaboratorId };
    return fetchList({
      model: WorkLogModel,
      query,
      paginationDto,
      path: `${commonPath}/collaborator/${collaboratorId}`,
      resourceName: "WorkLogs",
    });
  }

  async getWorkLogById(id: string) {
    const resource = await WorkLogModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    const response = OldSuccessResponseFormatter.formatGetOneResponse<WorkLog>({
      data: resource,
      resource: resourceName,
    });

    return response;
  }

  async createWorkLog(
    dto: WorkLogDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    const activities = await this.createOrUpdateActivities(dto, uid);

    const resource = new WorkLogModel({
      ...dto.data,
      activities: activities,
      createdBy: uid as unknown as ObjectId,
      updatedBy: uid as unknown as ObjectId,
    });

    const savedResource = await resource.save();
    const populatedResource = await WorkLogModel.populate(savedResource, {
      path: "activities",
    });

    const response = OldSuccessResponseFormatter.fortmatCreateResponse<WorkLog>(
      {
        data: populatedResource,
        resource: resourceName,
      }
    );

    return response;
  }

  async updateWorkLog(
    id: string,
    dto: WorkLogDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    const activities = await this.createOrUpdateActivities(dto, uid);

    const resourceToUpdate = await WorkLogModel.findById(id);
    if (!resourceToUpdate)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

    const updatedResource = await WorkLogModel.findByIdAndUpdate(
      id,
      {
        ...dto.data,
        activities: activities,
        updatedAt: new Date(),
        updatedBy: uid,
      },
      { new: true }
    );

    const populatedResource = await WorkLogModel.populate(updatedResource, {
      path: "activities",
    });

    const response = OldSuccessResponseFormatter.formatUpdateResponse<WorkLog>({
      data: populatedResource!,
      resource: resourceName,
    });

    return response;
  }

  async deleteWorkLog(id: string) {
    const resource = await WorkLogModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

    const deletedResource = await WorkLogModel.findByIdAndDelete(id);
    const response = OldSuccessResponseFormatter.formatDeleteResponse<WorkLog>({
      data: deletedResource!,
      resource: resourceName,
    });

    return response;
  }

  private async createOrUpdateActivities(
    dto: WorkLogDto,
    uid: string
  ): Promise<WorkLogActivity[] | undefined> {
    const activities: WorkLogActivity[] = [];

    if (dto.data.activities) {
      for (const activity of dto.data.activities) {
        const workLogActivity: WorkLogActivity = {
          ...activity,
          createdBy: uid as unknown as ObjectId,
          updatedBy: uid as unknown as ObjectId,
          createdAt: new Date(),
          updatedAt: new Date(),
        };

        let relatedTaskActivityId: string | undefined = undefined;

        if (activity.relatedTask) {
          // Fetch the TaskModel with the id of the relatedTask
          const task = await TaskModel.findById(activity.relatedTask);

          if (task) {
            if (activity.relatedTaskActivity) {
              // If the task activity is provided, update it
              const updatedTaskActivity =
                await TaskActivityModel.findByIdAndUpdate(
                  activity.relatedTaskActivity,
                  {
                    ...workLogActivity,
                    author: uid as unknown as ObjectId,
                    registeredAt: dto.data.logDate,
                  },
                  { new: true }
                );
              relatedTaskActivityId = updatedTaskActivity?._id?.toString();
            } else {
              // If no task activity is provided, create a new one
              const newActivity = new TaskActivityModel({
                ...workLogActivity,
                author: uid as unknown as ObjectId,
                registeredAt: dto.data.logDate,
              });
              const updatedTaskActivity = await newActivity.save();
              relatedTaskActivityId = updatedTaskActivity?._id?.toString();
              if (!task.activities) {
                task.activities = [];
              }

              // Push the updated task activity
              if (updatedTaskActivity) {
                task.activities.push(updatedTaskActivity);
              }
            }

            // const taskStatus = getTaskStatus(task.status);

            await TaskModel.findOneAndUpdate(
              { _id: activity.relatedTask },
              { activities: task.activities },
              { new: true }
            );
          }
        }

        // Push the original workLogActivity to the activities array
        (workLogActivity.relatedTaskActivity =
          relatedTaskActivityId as unknown as ObjectId),
          activities.push(workLogActivity);
      }
    }

    return activities;
  }
}
