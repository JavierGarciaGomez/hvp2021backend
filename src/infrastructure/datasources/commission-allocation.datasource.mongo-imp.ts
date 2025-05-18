import { CommissionAllocationDatasource } from "../../domain";
import { CommissionAllocationEntity } from "../../domain/entities";
import { CommissionAllocationModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class CommissionAllocationDatasourceMongoImp
  extends BaseDatasourceMongoImp<CommissionAllocationEntity>
  implements CommissionAllocationDatasource
{
  constructor() {
    super(CommissionAllocationModel, CommissionAllocationEntity);
  }
}
