import { NextFunction, Response } from "express";
import mongoose from "mongoose";
import {
  ListSuccessResponse,
  ResourceQuery,
  SingleSuccessResponse,
} from "../data/types";
import { PaginationDto, SortingDto } from "../domain";
import { SuccessResponseFormatter } from "../presentation/services/SuccessResponseFormatter";
import { BaseError } from "../domain/errors/BaseError";
import { envs } from "../config";

export const handleError = (
  error: unknown,
  res: Response,
  next: NextFunction
) => {
  next(error);
};

interface FetchListParams<T> {
  model: mongoose.Model<T>;
  query: ResourceQuery<T>;
  paginationDto: PaginationDto;
  sortingDto?: SortingDto;
  all?: boolean;
  path: string;
  resourceName: string;
  populateOptions?: mongoose.PopulateOptions[];
}

export const fetchList = async <T>(
  params: FetchListParams<T>
): Promise<ListSuccessResponse<T>> => {
  const {
    model,
    query,
    paginationDto,
    all,
    path,
    resourceName,
    sortingDto,
    populateOptions = [],
  } = params;
  const { page, limit } = paginationDto;

  try {
    let data;
    let total;

    // Prepare sorting options if provided
    const sortOptions: { [key: string]: 1 | -1 } = {};
    if (sortingDto && sortingDto.sort_by) {
      sortOptions[sortingDto.sort_by] =
        sortingDto.direction === "DESC" ? -1 : 1;
    }

    // Check if 'all' is true or if page and limit are not provided
    if (all || page === undefined || limit === undefined) {
      data = await model.find(query);
      total = data.length;
    } else {
      // Fetch paginated data
      total = await model.countDocuments(query);
      data = await model
        .find(query)
        .sort(sortOptions)
        .skip((page - 1) * limit)
        .limit(limit)
        .populate(populateOptions);
    }

    const response = SuccessResponseFormatter.formatListResponse<T>({
      data,
      page: page ?? 1,
      limit: limit ?? data.length,
      total,
      path,
      resource: resourceName,
    });

    return response;
  } catch (error) {
    throw BaseError.internalServer("Internal Server Error");
  }
};

interface FetchStaticListParams<T> {
  data: T[];
  paginationDto: PaginationDto;
  path: string;
  resourceName: string;
}

export const fetchStaticList = <T>({
  data,
  paginationDto,
  path,
  resourceName,
}: FetchStaticListParams<T>): ListSuccessResponse<T> => {
  const { page = 1, limit = data.length } = paginationDto;
  let paginatedData;
  if (!page || !limit) {
    paginatedData = data;
  } else {
    paginatedData = data.slice((page - 1) * limit, page * limit);
  }

  return SuccessResponseFormatter.formatListResponse<T>({
    data: paginatedData,
    page,
    limit,
    total: data.length,
    path,
    resource: resourceName,
  });
};

type FetchByIdParams<T> = {
  id: string;
  model: mongoose.Model<T>;
  resourceName: string;
};
export const fetchById = async <T>(
  params: FetchByIdParams<T>
): Promise<SingleSuccessResponse<T>> => {
  const { model, id, resourceName } = params;
  const data = await model.findById(id);
  if (!data) {
    throw BaseError.notFound(`${resourceName} not found`);
  }
  return SuccessResponseFormatter.formatGetOneResponse<T>({
    data,
    resource: resourceName,
  });
};
