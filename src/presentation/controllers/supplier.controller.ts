import { SupplierDTO, SupplierService } from "../../application";
import { BaseController } from "./base.controller";
import { SupplierEntity } from "../../domain";

export class SupplierController extends BaseController<
  SupplierEntity,
  SupplierDTO
> {
  protected resource = "supplier";
  protected path = "/suppliers";
  constructor(protected service: SupplierService) {
    super(service, SupplierDTO);
  }
}
