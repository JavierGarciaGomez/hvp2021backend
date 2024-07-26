import { ProductDatasource } from "../../domain";
import { ProductEntity } from "../../domain/entities";
import { ProductModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo";

export class ProductDatasourceMongoImp
  extends BaseDatasourceMongoImp<ProductEntity>
  implements ProductDatasource
{
  constructor() {
    super(ProductModel, ProductEntity);
  }
}
