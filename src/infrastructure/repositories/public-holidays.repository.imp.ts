import { PublicHolidaysDatasource } from "../../domain";
import { PublicHolidaysEntity } from "../../domain/entities";
import { PublicHolidaysRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class PublicHolidaysRepositoryImpl
  extends BaseRepositoryImpl<PublicHolidaysEntity>
  implements PublicHolidaysRepository
{
  constructor(protected readonly datasource: PublicHolidaysDatasource) {
    super(datasource);
  }
}
