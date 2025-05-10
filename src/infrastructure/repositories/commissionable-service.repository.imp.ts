import { CommissionableServiceDatasource } from "../../domain";
import { CommissionableServiceEntity } from "../../domain/entities";
import { CommissionableServiceRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class CommissionableServiceRepositoryImpl
  extends BaseRepositoryImpl<CommissionableServiceEntity>
  implements CommissionableServiceRepository
{
  constructor(protected readonly datasource: CommissionableServiceDatasource) {
    super(datasource);
  }
}
