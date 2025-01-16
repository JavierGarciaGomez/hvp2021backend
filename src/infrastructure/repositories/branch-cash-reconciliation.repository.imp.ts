import { BranchCashReconciliationDatasource } from "../../domain";
import { BranchCashReconciliationEntity } from "../../domain/entities";
import { BranchCashReconciliationRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class BranchCashReconciliationRepositoryImpl
  extends BaseRepositoryImpl<BranchCashReconciliationEntity>
  implements BranchCashReconciliationRepository
{
  constructor(
    protected readonly datasource: BranchCashReconciliationDatasource
  ) {
    super(datasource);
  }
}
