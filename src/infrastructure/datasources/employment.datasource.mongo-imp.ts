import { EmploymentDatasource } from "../../domain";
import { EmploymentEntity } from "../../domain/entities";
import { EmploymentModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class EmploymentDatasourceMongoImp
  extends BaseDatasourceMongoImp<EmploymentEntity>
  implements EmploymentDatasource
{
  constructor() {
    super(EmploymentModel, EmploymentEntity);
  }
}
