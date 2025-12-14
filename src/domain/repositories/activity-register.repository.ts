import { CustomQueryOptions } from "../../shared";
import { ActivityRegisterEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export abstract class ActivityRegisterRepository extends BaseRepository<ActivityRegisterEntity> {
  abstract createMany(
    notifications: ActivityRegisterEntity[]
  ): Promise<ActivityRegisterEntity[]>;

  abstract getByDateRange(
    queryOptions: CustomQueryOptions
  ): Promise<ActivityRegisterEntity[]>;
}
