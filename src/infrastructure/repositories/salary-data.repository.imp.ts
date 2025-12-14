import { SalaryDataDatasource } from "../../domain";
import { SalaryDataEntity } from "../../domain/entities";
import { SalaryDataRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class SalaryDataRepositoryImpl
  extends BaseRepositoryImpl<SalaryDataEntity>
  implements SalaryDataRepository
{
  constructor(protected readonly datasource: SalaryDataDatasource) {
    super(datasource);
  }
}
