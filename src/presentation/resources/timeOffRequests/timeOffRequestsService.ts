import TimeOffRequestModel from "../../../data/models/TimeOffRequestModel";
import { ListSuccessResponse } from "../../../data/types/responses";
import { TimeOffRequest } from "../../../data/types/timeOffTypes";
import { PaginationDto } from "../../../domain";
import { BaseError } from "../../../domain/errors/BaseError";
import { SuccessResponseFormatter } from "../../services/SuccessResponseFormatter";
import { TimeOffRoutes } from "./timeOffRequestsRoutes";

// import {
//   CreateCategoryDto,
//   CustomError,
//   PaginationDto,
//   UserEntity,
// } from "../../domain";

const commonPath = "/api/time-off-requests";
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
    const { page, limit, all } = paginationDto;

    try {
      if (all) {
        // If 'all' is present, fetch all resources without pagination
        const allData = await TimeOffRequestModel.find();

        const response =
          SuccessResponseFormatter.formatListResponse<TimeOffRequest>({
            data: allData,
            page: 1, // Setting page to 1 as there is no pagination
            limit: allData.length, // Set limit to the total number of items
            total: allData.length,
            path: `${commonPath}${TimeOffRoutes.all}`,
            resource: "TimeOffRequests",
          });

        return response;
      }

      // Fetch paginated time-off requests
      const [total, data] = await Promise.all([
        TimeOffRequestModel.countDocuments(),
        TimeOffRequestModel.find()
          .skip((page - 1) * limit)
          .limit(limit),
      ]);

      const response =
        SuccessResponseFormatter.formatListResponse<TimeOffRequest>({
          data,
          page,
          limit,
          total,
          path: `${commonPath}${TimeOffRoutes.all}`,
          resource: "TimeOffRequests",
        });

      return response;
    } catch (error) {
      throw BaseError.internalServer("Internal Server Error");
    }
  }
}
