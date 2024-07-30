import { SupplierDatasource } from "../../domain";
import { SupplierEntity } from "../../domain/entities";
import { SupplierModel } from "../db";

import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class SupplierDataSourceMongoImp
  extends BaseDatasourceMongoImp<SupplierEntity>
  implements SupplierDatasource
{
  constructor() {
    super(SupplierModel, SupplierEntity);
  }
}
