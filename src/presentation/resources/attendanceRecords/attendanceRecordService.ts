import { mainRoutes } from "./../../../mainRoutes";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../shared/errors/BaseError";
import { OldSuccessResponseFormatter } from "../../services/SuccessResponseFormatter";

import { AuthenticatedCollaborator } from "../../../shared/interfaces/RequestsAndResponses";
import { WorkLogDto } from "../../../domain/dtos/workLogs/WorkLogDto";

import TaskActivityModel from "../../../infrastructure/db/mongo/models/TaskActivityModel";

import TaskModel from "../../../infrastructure/db/mongo/models/TaskModel";
import AttendanceRecordModel from "../../../infrastructure/db/mongo/models/AttendanceRecordModel";
import { AttendanceRecordDto } from "../../../domain/dtos/attendanceRecords/AttendanceRecordDto";

import { getCurrentMexicanDate } from "../../../shared/helpers/dateHelpers";
import {
  AttendanceRecord,
  ListSuccessResponse,
  WorkLogActivity,
} from "../../../shared";
import { fetchList } from "../../../shared/helpers";
import { ObjectId } from "mongoose";

const commonPath = mainRoutes.attendanceRecords;
const resourceName = "AttendanceRecords";
export class AttendanceRecordsService {
  // DI
  constructor() {}

  async getAttendanceRecords(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<AttendanceRecord>> {
    return fetchList({
      model: AttendanceRecordModel,
      query: {},
      paginationDto,
      path: `${commonPath}`,
      resourceName: "AttendanceRecords",
    });
  }

  async getAttendanceRecordsByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<AttendanceRecord>> {
    const query = { collaborator: collaboratorId };
    return fetchList({
      model: AttendanceRecordModel,
      query,
      paginationDto,
      path: `${commonPath}`,
      resourceName: "AttendanceRecords",
    });
  }

  async getCurrentAttendanceRecords(paginationDto: PaginationDto) {
    const todayDate = getCurrentMexicanDate();
    const query = {
      shiftDate: todayDate,
    };
    return fetchList({
      model: AttendanceRecordModel,
      query,
      paginationDto,
      path: `${commonPath}`,
      resourceName: "AttendanceRecords",
    });
  }

  async getLastAttendanceRecordByCollaborator(collaboratorId: string) {
    const query = { collaborator: collaboratorId };
    const resource = await AttendanceRecordModel.findOne(query).sort(
      "-shiftDate"
    );
    if (!resource)
      throw BaseError.notFound(
        `${resourceName} not found for collaborator ${collaboratorId}`
      );
    const response =
      OldSuccessResponseFormatter.formatGetOneResponse<AttendanceRecord>({
        data: resource,
        resource: resourceName,
      });

    return response;
  }

  async getAttendanceRecordById(id: string) {
    const resource = await AttendanceRecordModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resource} not found with id ${id}`);

    const response =
      OldSuccessResponseFormatter.formatGetOneResponse<AttendanceRecord>({
        data: resource,
        resource: resourceName,
      });

    return response;
  }

  async createAttendanceRecord(
    dto: AttendanceRecordDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    // todo review if the collaborator has already an attendance record for the same day
    const existingAttendanceRecord = await AttendanceRecordModel.findOne({
      collaborator: uid,
      shiftDate: dto.data.shiftDate,
    });

    if (existingAttendanceRecord) {
      throw BaseError.badRequest(
        `Attendance record already exists for collaborator ${uid} and date ${dto.data.shiftDate}`
      );
    }

    // const activities = await this.createOrUpdateActivities(dto, uid);

    const resource = new AttendanceRecordModel({
      ...dto.data,
      createdBy: uid as unknown as ObjectId,
      updatedBy: uid as unknown as ObjectId,
    });

    const savedResource = await resource.save();

    const response =
      OldSuccessResponseFormatter.fortmatCreateResponse<AttendanceRecord>({
        data: savedResource,
        resource: resourceName,
      });

    return response;
  }

  async updateAttendanceRecord(
    id: string,
    dto: AttendanceRecordDto,
    authenticatedCollaborator: AuthenticatedCollaborator
  ) {
    const { uid } = authenticatedCollaborator;

    const resourceToUpdate = await AttendanceRecordModel.findById(id);
    if (!resourceToUpdate)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

    const updatedResource = await AttendanceRecordModel.findByIdAndUpdate(
      id,
      {
        ...dto.data,
        updatedAt: new Date(),
        updatedBy: uid,
      },
      { new: true }
    );

    const response =
      OldSuccessResponseFormatter.formatUpdateResponse<AttendanceRecord>({
        data: updatedResource!,
        resource: resourceName,
      });

    return response;
  }

  async deleteWorkLog(id: string) {
    const resource = await AttendanceRecordModel.findById(id);
    if (!resource)
      throw BaseError.notFound(`${resourceName} not found with id ${id}`);

    const deletedResource = await AttendanceRecordModel.findByIdAndDelete(id);
    const response =
      OldSuccessResponseFormatter.formatDeleteResponse<AttendanceRecord>({
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
