import { MissingProductDatasource } from "../../domain";
import { MissingProductEntity } from "../../domain/entities";
import { MissingProductRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class MissingProductRepositoryImp
  extends BaseRepositoryImpl<MissingProductEntity>
  implements MissingProductRepository
{
  constructor(protected readonly datasource: MissingProductDatasource) {
    super(datasource);
  }
}
