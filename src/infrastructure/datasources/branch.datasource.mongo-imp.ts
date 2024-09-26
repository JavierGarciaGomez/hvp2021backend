import { BranchDatasource } from "../../domain";
import { BranchEntity } from "../../domain/entities";
import { BranchModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class BranchDatasourceMongoImp
  extends BaseDatasourceMongoImp<BranchEntity>
  implements BranchDatasource
{
  constructor() {
    super(BranchModel, BranchEntity);
  }
}
