import { SupplierDatasource, SupplierRepository } from "../../domain";
import { SupplierEntity } from "../../domain/entities";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class SupplierRepositoryImp
  extends BaseRepositoryImpl<SupplierEntity>
  implements SupplierRepository
{
  constructor(protected readonly datasource: SupplierDatasource) {
    super(datasource);
  }
}
