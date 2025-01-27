import { TimeOffRequestDatasource } from "../../domain";
import { TimeOffRequestEntity } from "../../domain/entities";
import { TimeOffRequestRepository } from "../../domain/repositories";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class TimeOffRequestRepositoryImpl
  extends BaseRepositoryImpl<TimeOffRequestEntity>
  implements TimeOffRequestRepository
{
  constructor(protected readonly datasource: TimeOffRequestDatasource) {
    super(datasource);
  }
}
