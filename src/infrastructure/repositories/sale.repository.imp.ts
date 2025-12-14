import { SaleDatasource } from "../../domain";
import { SaleEntity } from "../../domain/entities";
import { SaleRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class SaleRepositoryImpl
  extends BaseRepositoryImpl<SaleEntity>
  implements SaleRepository
{
  constructor(protected readonly datasource: SaleDatasource) {
    super(datasource);
  }
}
