import { AccountEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class AccountDatasource extends BaseDatasource<AccountEntity> {}
