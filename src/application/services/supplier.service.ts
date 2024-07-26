import { SupplierEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { SupplierRepository } from "../../domain";
import { SupplierDTO } from "../dtos";

export class SupplierService extends BaseService<SupplierEntity, SupplierDTO> {
  constructor(protected readonly repository: SupplierRepository) {
    super(repository, SupplierEntity);
  }

  protected getResourceName(): string {
    return "supplier";
  }
}
