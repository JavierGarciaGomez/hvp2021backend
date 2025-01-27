import { TimeOffRequestDatasource } from "../../domain";
import { TimeOffRequestEntity } from "../../domain/entities";
import { TimeOffRequestModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class TimeOffRequestDatasourceMongoImp
  extends BaseDatasourceMongoImp<TimeOffRequestEntity>
  implements TimeOffRequestDatasource
{
  constructor() {
    super(TimeOffRequestModel, TimeOffRequestEntity);
  }
}
