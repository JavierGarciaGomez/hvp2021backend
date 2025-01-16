import { SimplifiedBranchCashReconciliationDatasource } from "../../domain";
import { SimplifiedBranchCashReconciliationEntity } from "../../domain/entities";
import { SimplifiedBranchCashReconciliationModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class SimplifiedBranchCashReconciliationDatasourceMongoImp
  extends BaseDatasourceMongoImp<SimplifiedBranchCashReconciliationEntity>
  implements SimplifiedBranchCashReconciliationDatasource
{
  constructor() {
    super(
      SimplifiedBranchCashReconciliationModel,
      SimplifiedBranchCashReconciliationEntity
    );
  }
}
