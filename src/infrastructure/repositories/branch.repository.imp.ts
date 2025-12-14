import { BranchDatasource } from "../../domain";
import { BranchEntity } from "../../domain/entities";
import { BranchRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class BranchRepositoryImpl
  extends BaseRepositoryImpl<BranchEntity>
  implements BranchRepository
{
  constructor(protected readonly datasource: BranchDatasource) {
    super(datasource);
  }
}
