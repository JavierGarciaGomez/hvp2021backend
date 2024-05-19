import { mainRoutes } from "./../../../mainRoutes";
import { AttendanceRecordsRoutes } from "./attendanceRecordsRoutes";
import { ResourceQuery } from "../../../data/types/Queries";
import { ListSuccessResponse } from "../../../data/types/responses";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";

import { AuthenticatedCollaborator } from "../../../types/RequestsAndResponses";
import mongoose, { ObjectId, Schema } from "mongoose";
import { AttendanceRecordsPaths } from "./attendanceRecordsRoutes";
import { WorkLogDto } from "../../../domain/dtos/workLogs/WorkLogDto";

import TaskActivityModel from "../../../data/models/TaskActivityModel";

import { WorkLogActivity } from "../../../data/types/workLogsTypes";
import TaskModel from "../../../data/models/TaskModel";
import AttendanceRecordModel from "../../../data/models/AttendanceRecordModel";
import { AttendanceRecordDto } from "../../../domain/dtos/attendanceRecords/AttendanceRecordDto";
import { AttendanceRecord } from "../../../data/types/attendanceRecordType";
import { getCurrentMexicanDate } from "../../../helpers/dateHelpers";

const commonPath = mainRoutes.attendanceRecords;
const resourceName = "AttendanceRecords";
export class AttendanceRecordsService {
  // DI
  constructor() {}

  async getAttendanceRecords(
    paginationDto: PaginationDto
  ): Promise<ListSuccessResponse<AttendanceRecord>> {
    const { all } = paginationDto;
    return this.fetchLists({}, paginationDto, all);
  }

  async getAttendanceRecordsByCollaborator(
    paginationDto: PaginationDto,
    collaboratorId: string
  ): Promise<ListSuccessResponse<AttendanceRecord>> {
    const { all } = paginationDto;
    const query = { collaborator: collaboratorId };
    return this.fetchLists(query, paginationDto, all);
  }

  async getCurrentAttendanceRecords(paginationDto: PaginationDto) {
    const { all } = paginationDto;
    const todayDate = getCurrentMexicanDate();
    const query = {
      shiftDate: todayDate,
    };
    return this.fetchLists(query, paginationDto, all);
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
      SuccessResponseFormatter.formatGetOneResponse<AttendanceRecord>({
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
      SuccessResponseFormatter.formatGetOneResponse<AttendanceRecord>({
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
      SuccessResponseFormatter.fortmatCreateResponse<AttendanceRecord>({
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
      SuccessResponseFormatter.formatUpdateResponse<AttendanceRecord>({
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
      SuccessResponseFormatter.formatDeleteResponse<AttendanceRecord>({
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

  private async fetchLists(
    query: ResourceQuery<AttendanceRecord>,
    paginationDto: PaginationDto,
    all: boolean
  ): Promise<ListSuccessResponse<AttendanceRecord>> {
    const { page, limit } = paginationDto;

    try {
      let data;

      if (all) {
        // If 'all' is present, fetch all resources without pagination
        data = await AttendanceRecordModel.find(query);
      } else {
        // Fetch paginated time-off requests
        const [total, paginatedData] = await Promise.all([
          AttendanceRecordModel.countDocuments(query),
          AttendanceRecordModel.find(query)
            .skip((page - 1) * limit)
            .limit(limit),
        ]);

        data = paginatedData;
      }

      const response =
        SuccessResponseFormatter.formatListResponse<AttendanceRecord>({
          data,
          page,
          limit,
          total: data.length,
          path: `${commonPath}${AttendanceRecordsPaths.all}`,
          resource: "TimeOffRequests",
        });

      return response;
    } catch (error) {
      throw BaseError.internalServer("Internal Server Error");
    }
  }
}
