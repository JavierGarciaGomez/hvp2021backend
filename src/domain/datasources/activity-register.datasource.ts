import { CustomQueryOptions } from "../../shared";
import { ActivityRegisterEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class ActivityRegisterDatasource extends BaseDatasource<ActivityRegisterEntity> {
  abstract createMany(
    notifications: ActivityRegisterEntity[]
  ): Promise<ActivityRegisterEntity[]>;

  abstract getByDateRange(
    queryOptions: CustomQueryOptions
  ): Promise<ActivityRegisterEntity[]>;
}
