import { SimplifiedBranchCashReconciliationDatasource } from "../../domain";
import { SimplifiedBranchCashReconciliationEntity } from "../../domain/entities";
import { SimplifiedBranchCashReconciliationRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class SimplifiedBranchCashReconciliationRepositoryImpl
  extends BaseRepositoryImpl<SimplifiedBranchCashReconciliationEntity>
  implements SimplifiedBranchCashReconciliationRepository
{
  constructor(
    protected readonly datasource: SimplifiedBranchCashReconciliationDatasource
  ) {
    super(datasource);
  }
}
