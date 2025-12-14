import { PayrollDatasource } from "../../domain";
import { PayrollEntity } from "../../domain/entities";
import { PayrollRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class PayrollRepositoryImpl
  extends BaseRepositoryImpl<PayrollEntity>
  implements PayrollRepository
{
  constructor(protected readonly datasource: PayrollDatasource) {
    super(datasource);
  }
}
