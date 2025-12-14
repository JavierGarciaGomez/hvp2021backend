import { WeekShiftDatasource } from "../../domain";
import { WeekShiftEntity } from "../../domain/entities";
import { WeekShiftRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class WeekShiftRepositoryImpl
  extends BaseRepositoryImpl<WeekShiftEntity>
  implements WeekShiftRepository
{
  constructor(protected readonly datasource: WeekShiftDatasource) {
    super(datasource);
  }
}
