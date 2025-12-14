import { SalaryDataDatasource } from "../../domain";
import { SalaryDataEntity } from "../../domain/entities";
import { SalaryDataModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class SalaryDataDatasourceMongoImp
  extends BaseDatasourceMongoImp<SalaryDataEntity>
  implements SalaryDataDatasource
{
  constructor() {
    super(SalaryDataModel, SalaryDataEntity);
  }
}
