import { JobEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class JobDatasource extends BaseDatasource<JobEntity> {}
