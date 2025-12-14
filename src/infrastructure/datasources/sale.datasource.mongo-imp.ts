import { SaleDatasource } from "../../domain";
import { SaleEntity } from "../../domain/entities";

import { SaleModel } from "../db/mongo/models/sale.model";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";

export class SaleDatasourceMongoImp
  extends BaseDatasourceMongoImp<SaleEntity>
  implements SaleDatasource
{
  constructor() {
    super(SaleModel, SaleEntity);
  }
}
