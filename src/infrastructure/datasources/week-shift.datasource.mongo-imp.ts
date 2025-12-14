import { WeekShiftDatasource } from "../../domain";
import { WeekShiftEntity } from "../../domain/entities";
import { WeekShiftModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class WeekShiftDatasourceMongoImp
  extends BaseDatasourceMongoImp<WeekShiftEntity>
  implements WeekShiftDatasource
{
  constructor() {
    super(WeekShiftModel, WeekShiftEntity);
  }
}
