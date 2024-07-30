import {
  ActivityRegisterDatasource,
  ActivityRegisterRepository,
} from "../../domain";
import { ActivityRegisterEntity } from "../../domain/entities";
import { CustomQueryOptions } from "../../shared";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class ActivityRegisterRepositoryImp
  extends BaseRepositoryImpl<ActivityRegisterEntity>
  implements ActivityRegisterRepository
{
  constructor(protected readonly datasource: ActivityRegisterDatasource) {
    super(datasource);
  }

  public getByDateRange = async (
    queryOptions: CustomQueryOptions
  ): Promise<ActivityRegisterEntity[]> => {
    return await this.datasource.getByDateRange(queryOptions);
  };
}
