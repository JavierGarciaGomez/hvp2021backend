import { CommissionAllocationDatasource } from "../../domain";
import { CommissionAllocationEntity } from "../../domain/entities";
import { CommissionAllocationRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class CommissionAllocationRepositoryImpl
  extends BaseRepositoryImpl<CommissionAllocationEntity>
  implements CommissionAllocationRepository
{
  constructor(protected readonly datasource: CommissionAllocationDatasource) {
    super(datasource);
  }
}
