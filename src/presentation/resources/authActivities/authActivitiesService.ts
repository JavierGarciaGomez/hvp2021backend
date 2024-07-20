import { buildRelativePath } from "./../../../shared/helpers/miscHelpers";
import { PaginationDto, SortingDto } from "../../../domain";

import { mainRoutes } from "../../../mainRoutes";
import { routes } from "./authActivitiesRoutes";
import {
  AuthActivity,
  AuthActivityType,
  ListSuccessResponse,
  SingleSuccessResponse,
} from "../../../shared";
import { fetchById, fetchList } from "../../../shared/helpers";
import { AuthActivityModel } from "../../../infrastructure";

export class AuthActivitiesService {
  constructor() {}

  async list(
    paginationDto: PaginationDto,
    sortingDto: SortingDto
  ): Promise<ListSuccessResponse<AuthActivity>> {
    return fetchList({
      model: AuthActivityModel,
      query: {},
      paginationDto,
      sortingDto,
      path: "auth-activities",
      resourceName: "AuthActivity",
    });
  }

  static async logActivity(userId: string, activity: AuthActivityType) {
    await AuthActivityModel.create({
      user: userId,
      activity,
      createdBy: userId,
      updatedBy: userId,
    });
  }

  async byId(id: string): Promise<SingleSuccessResponse<AuthActivity>> {
    return fetchById({
      model: AuthActivityModel,
      id,
      resourceName: "AuthActivity",
    });
  }

  async listByUserId(
    userId: string,
    paginationDto: PaginationDto,
    sortingDto: SortingDto
  ): Promise<ListSuccessResponse<AuthActivity>> {
    return fetchList({
      model: AuthActivityModel,
      query: { user: userId },
      paginationDto,
      sortingDto,
      path: buildRelativePath(
        mainRoutes.authActivities,
        routes.byUserId,
        userId
      ),
      resourceName: "AuthActivity",
    });
  }
}
