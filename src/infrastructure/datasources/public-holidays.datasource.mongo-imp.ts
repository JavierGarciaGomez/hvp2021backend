import { PublicHolidaysDatasource } from "../../domain";
import { PublicHolidaysEntity } from "../../domain/entities";
import { PublicHolidaysModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class PublicHolidaysDatasourceMongoImp
  extends BaseDatasourceMongoImp<PublicHolidaysEntity>
  implements PublicHolidaysDatasource
{
  constructor() {
    super(PublicHolidaysModel, PublicHolidaysEntity);
  }
}
