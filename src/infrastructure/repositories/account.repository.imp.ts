import { AccountDatasource } from "../../domain";
import { AccountEntity } from "../../domain/entities";
import { AccountRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class AccountRepositoryImpl
  extends BaseRepositoryImpl<AccountEntity>
  implements AccountRepository
{
  constructor(protected readonly datasource: AccountDatasource) {
    super(datasource);
  }
}
