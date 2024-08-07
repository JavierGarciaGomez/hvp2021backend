import { Model } from "mongoose";
import { FilteringDto } from "../../application/dtos/shared/filtering.dto";
import { PaginationDto, SortingDto } from "../../domain";
import { CustomQueryOptions } from "../interfaces";

export const buildQueryOptions = (queryParams: any): CustomQueryOptions => {
  const { page, limit, sort_by, direction, ...filterParams } = queryParams;
  const paginationDto = PaginationDto.create(page, limit);
  const sortingDto = SortingDto.create(sort_by, direction);
  const filteringDto = FilteringDto.create(filterParams);

  return {
    paginationDto,
    sortingDto,
    filteringDto,
  };
};

export const getAllHelper = async <T>(
  model: Model<T>,
  queryOptions: CustomQueryOptions
): Promise<T[]> => {
  const { paginationDto, filteringDto, sortingDto } = queryOptions;
  const sortField = sortingDto.sort_by || "updated_at";
  const sortDirection = sortingDto.direction === "asc" ? 1 : -1;
  const page = paginationDto.page || 1; // Default to 1 if page is not provided
  const limit = paginationDto.limit ?? 0;

  const result = await model
    .find(filteringDto as any)
    .sort({ [sortField]: sortDirection })
    .skip((page - 1) * limit) // Correct skip calculation
    .limit(limit);

  return result;
};

export interface IFilteringParams {
  [key: string]: string | undefined;
}
