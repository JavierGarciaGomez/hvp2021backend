import { JobDatasource } from "../../domain";
import { JobEntity } from "../../domain/entities";
import { JobModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class JobDatasourceMongoImp
  extends BaseDatasourceMongoImp<JobEntity>
  implements JobDatasource
{
  constructor() {
    super(JobModel, JobEntity);
  }
}
