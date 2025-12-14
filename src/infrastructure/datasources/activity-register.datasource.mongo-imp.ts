import { ActivityRegisterDatasource } from "../../domain";
import { ActivityRegisterEntity } from "../../domain/entities";
import { CustomQueryOptions, getAllByDateRangeHelper } from "../../shared";
import { ActivityRegisterModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class ActivityRegisterDataSourceMongoImp
  extends BaseDatasourceMongoImp<ActivityRegisterEntity>
  implements ActivityRegisterDatasource
{
  constructor() {
    super(ActivityRegisterModel, ActivityRegisterEntity);
  }
  public getByDateRange = async (
    queryOptions: CustomQueryOptions
  ): Promise<ActivityRegisterEntity[]> => {
    const result = await getAllByDateRangeHelper(this.model, queryOptions, [
      "startingTime",
      "endingTime",
    ]);
    return result.map(this.entity.fromDocument);
  };
}
