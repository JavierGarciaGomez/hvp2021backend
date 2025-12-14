import { MissingProductDatasource } from "../../domain";
import { MissingProductEntity } from "../../domain/entities";
import { MissingProductModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class MissingProductDatasourceMongoImp
  extends BaseDatasourceMongoImp<MissingProductEntity>
  implements MissingProductDatasource
{
  constructor() {
    super(MissingProductModel, MissingProductEntity);
  }
}
