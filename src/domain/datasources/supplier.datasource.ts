import { SupplierEntity } from "../entities";
import { BaseDatasource } from "./base.datasource";

export abstract class SupplierDatasource extends BaseDatasource<SupplierEntity> {
  abstract createMany(
    notifications: SupplierEntity[]
  ): Promise<SupplierEntity[]>;
}
