import { JobDatasource } from "../../domain";
import { JobEntity } from "../../domain/entities";
import { JobRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class JobRepositoryImpl
  extends BaseRepositoryImpl<JobEntity>
  implements JobRepository
{
  constructor(protected readonly datasource: JobDatasource) {
    super(datasource);
  }
}
