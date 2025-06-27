import { Model, ClientSession } from "mongoose";
import { FilteringDto } from "../../application/dtos/shared/filtering.dto";
import { PaginationDto, SortingDto } from "../../domain";
import { CustomQueryOptions } from "../interfaces";
import { calculateDurationDTO } from "../../application";

export const buildQueryOptions = (queryParams: any): CustomQueryOptions => {
  const {
    page,
    limit,
    sort_by,
    direction,
    startDate,
    endDate,
    ...filterParams
  } = queryParams;
  const paginationDto = PaginationDto.create(page, limit);
  const sortingDto = SortingDto.create(sort_by, direction);
  const calculateDurationDto = calculateDurationDTO.create(startDate, endDate);
  const filteringDto = FilteringDto.create(filterParams);

  return {
    paginationDto,
    sortingDto,
    filteringDto,
    calculateDurationDto,
  };
};

export const getAllHelper = async <T>(
  model: Model<T>,
  queryOptions?: CustomQueryOptions,
  session?: ClientSession
): Promise<T[]> => {
  const { paginationDto, filteringDto, sortingDto } = queryOptions || {};
  const sortField = sortingDto?.sort_by || "updated_at";
  const sortDirection = sortingDto?.direction === "desc" ? -1 : 1;
  const page = paginationDto?.page || 1; // Default to 1 if page is not provided
  const limit = paginationDto?.limit ?? 0;

  const result = await model
    .find(filteringDto as any)
    .sort({ [sortField]: sortDirection })
    .skip((page - 1) * limit) // Correct skip calculation
    .limit(limit)
    .session(session || null);

  return result;
};

export const getAllByDateRangeHelper = async <T>(
  model: Model<T>,
  queryOptions: CustomQueryOptions,
  durationFields: string[]
): Promise<T[]> => {
  const { filteringDto, calculateDurationDto } = queryOptions;

  // Add date range filtering to findQuery
  const findQuery: any = {
    ...filteringDto,
  };

  if (calculateDurationDto?.startDate) {
    findQuery[durationFields[0]] = { $gte: calculateDurationDto.startDate };
  }
  if (calculateDurationDto?.endDate) {
    findQuery[durationFields[1]] = { $lte: calculateDurationDto.endDate };
  }
  const result = await model.find(findQuery);

  return result;
};
