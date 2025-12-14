import { BranchCashReconciliationDatasource } from "../../domain";
import { BranchCashReconciliationEntity } from "../../domain/entities";
import { BranchCashReconciliationModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class BranchCashReconciliationDatasourceMongoImp
  extends BaseDatasourceMongoImp<BranchCashReconciliationEntity>
  implements BranchCashReconciliationDatasource
{
  constructor() {
    super(BranchCashReconciliationModel, BranchCashReconciliationEntity);
  }
}
