import { CommissionableServiceDatasource } from "../../domain";
import { CommissionableServiceEntity } from "../../domain/entities";
import { CommissionableServiceModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class CommissionableServiceDatasourceMongoImp
  extends BaseDatasourceMongoImp<CommissionableServiceEntity>
  implements CommissionableServiceDatasource
{
  constructor() {
    super(CommissionableServiceModel, CommissionableServiceEntity);
  }
}
