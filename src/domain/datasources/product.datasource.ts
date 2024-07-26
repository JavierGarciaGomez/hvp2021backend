import { ProductEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class ProductDatasource extends BaseDatasource<ProductEntity> {}
