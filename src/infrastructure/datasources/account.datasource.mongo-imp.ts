import { AccountDatasource } from "../../domain";
import { AccountEntity, SalaryDataEntity } from "../../domain/entities";

import { AccountModel } from "../db/mongo/models/account.model";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class AccountDatasourceMongoImp
  extends BaseDatasourceMongoImp<AccountEntity>
  implements AccountDatasource
{
  constructor() {
    super(AccountModel, AccountEntity);
  }
}
