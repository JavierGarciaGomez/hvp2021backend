import { SupplierEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export abstract class SupplierRepository extends BaseRepository<SupplierEntity> {
  abstract createMany(
    notifications: SupplierEntity[]
  ): Promise<SupplierEntity[]>;
}
