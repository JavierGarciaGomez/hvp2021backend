import { EmploymentDatasource } from "../../domain";
import { EmploymentEntity } from "../../domain/entities";
import { EmploymentRepository } from "../../domain/repositories";

import { BaseRepositoryImpl } from "./base.repository.imp";

export class EmploymentRepositoryImpl
  extends BaseRepositoryImpl<EmploymentEntity>
  implements EmploymentRepository
{
  constructor(protected readonly datasource: EmploymentDatasource) {
    super(datasource);
  }
}
