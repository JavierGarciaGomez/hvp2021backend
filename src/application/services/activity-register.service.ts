import { ActivityRegisterEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { ActivityRegisterRepository } from "../../domain";
import { ActivityRegisterDTO } from "../dtos";
import {
  AuthenticatedRequest,
  BaseError,
  buildQueryOptions,
  CustomQueryOptions,
} from "../../shared";
import { NextFunction } from "express";

export class ActivityRegisterService extends BaseService<
  ActivityRegisterEntity,
  ActivityRegisterDTO
> {
  constructor(protected readonly repository: ActivityRegisterRepository) {
    super(repository, ActivityRegisterEntity);
  }

  public create = async (
    dto: ActivityRegisterDTO
  ): Promise<ActivityRegisterEntity> => {
    const entity = new this.entityClass(dto);
    const isOverlapping = await this.isActivityOverlapping(
      dto.collaborator,
      entity
    );
    if (!entity.isStartingTimeBeforeEndingTime()) {
      throw BaseError.badRequest("Starting time should be before ending time");
    }
    if (isOverlapping) {
      throw BaseError.conflict("Activity is overlapping with another activity");
    }
    return await this.repository.create(entity);
  };

  public update = async (
    id: string,
    dto: ActivityRegisterDTO
  ): Promise<ActivityRegisterEntity> => {
    const entity = new this.entityClass(dto);
    const isOverlapping = await this.isActivityOverlapping(
      dto.collaborator,
      entity
    );
    if (!entity.isStartingTimeBeforeEndingTime()) {
      throw BaseError.badRequest("Starting time should be before ending time");
    }
    if (isOverlapping) {
      throw BaseError.conflict("Activity is overlapping with another activity");
    }
    return await this.repository.update(id, entity);
  };

  public getResourceName(): string {
    return "activity-register";
  }

  public calculateDuration = async (
    queryOptions: CustomQueryOptions
  ): Promise<number> => {
    const activities = await this.repository.getByDateRange(queryOptions);
    return activities.reduce((acc, curr) => acc + curr.getDuration(), 0);
  };

  private async isActivityOverlapping(
    collaboratorId: string,
    newActivity: ActivityRegisterEntity
  ): Promise<boolean> {
    const query = { collaborator: collaboratorId };
    const options = buildQueryOptions(query);
    const existingActivities = await this.repository.getAll(options);

    return existingActivities.some((existingActivity) =>
      this.doActivitiesOverlap(newActivity, existingActivity)
    );
  }

  private doActivitiesOverlap(
    newActivity: ActivityRegisterEntity,
    existingActivity: ActivityRegisterEntity
  ): boolean {
    if (newActivity.id === existingActivity.id) {
      return false;
    }

    const newStartTime = new Date(newActivity.startingTime).getTime();
    const newEndTime = newActivity.endingTime
      ? new Date(newActivity.endingTime).getTime()
      : Infinity;

    const existingStartTime = new Date(existingActivity.startingTime).getTime();
    const existingEndTime = existingActivity.endingTime
      ? new Date(existingActivity.endingTime).getTime()
      : undefined;

    const newStartsDuringExisting = existingEndTime
      ? newStartTime >= existingStartTime && newStartTime < existingEndTime
      : false;

    const existingStartsDuringNew =
      existingStartTime >= newStartTime && existingStartTime < newEndTime;

    const startsAtSameTime = newStartTime === existingStartTime;

    const isOverlapping =
      newStartsDuringExisting || existingStartsDuringNew || startsAtSameTime;

    if (isOverlapping) {
      console.log("Overlapping activities:");
    }

    return (
      newStartsDuringExisting || existingStartsDuringNew || startsAtSameTime
    );
  }
}
