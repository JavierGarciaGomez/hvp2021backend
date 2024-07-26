import { ProductDatasource } from "../../domain";
import { ProductEntity } from "../../domain/entities";
import { ProductRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class ProductRepositoryImpl
  extends BaseRepositoryImpl<ProductEntity>
  implements ProductRepository
{
  constructor(protected readonly datasource: ProductDatasource) {
    super(datasource);
  }
}
