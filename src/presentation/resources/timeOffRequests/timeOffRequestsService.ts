import { ResourceQuery } from "./../../../data/types/Queries";
import TimeOffRequestModel from "../../../data/models/TimeOffRequestModel";

import { ListSuccessResponse } from "../../../data/types/responses";
import {
  TimeOffRequest,
  TimeOffStatus,
} from "../../../data/types/timeOffTypes";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { TimeOffRequestsRoutePaths } from "./timeOffRequestsRoutes";
import { TimeOffRequestDto } from "../../../domain/dtos/timeOffRequests/TimeOffRequestDto";
import { AuthenticatedCollaborator } from "../../../types/RequestsAndResponses";
import { ObjectId } from "mongoose";
import { CollaboratorRole } from "../../../models/Collaborator";

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

  //   async createCategory(createCategoryDto: CreateCategoryDto, user: UserEntity) {
  //     const categoryExists = await CategoryModel.findOne({
  //       name: createCategoryDto.name,
  //     });
  //     if (categoryExists) throw CustomError.badRequest("Category already exists");

  //     try {
  //       const category = new CategoryModel({
  //         ...createCategoryDto,
  //         user: user.id,
  //       });

  //       await category.save();

  //       return {
  //         id: category.id,
  //         name: category.name,
  //         available: category.available,
  //       };
  //     } catch (error) {
  //       throw CustomError.internalServer(`${error}`);
  //     }
  //   }

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

    const updatedResource = await TimeOffRequestModel.findByIdAndUpdate(
      id,
      { ...timeOffRequestDto, updatedAt: new Date(), updatedBy: uid },
      { new: true }
    );

    // const timeOffRequest = new TimeOffRequestModel({
    //   ...timeOffRequestDto,
    //   createdBy: uid as unknown as ObjectId,
    // });

    const response =
      SuccessResponseFormatter.formatUpdateResponse<TimeOffRequest>({
        data: timeOffRequest,
        resource,
      });

    return response;
  }
  async approveTimeOffRequest() {}
  async deleteTimeOffRequest() {}
  async getCollaboratorTimeOffOverview() {}
  async getCollaboratorsTimeOffOverview() {}

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
