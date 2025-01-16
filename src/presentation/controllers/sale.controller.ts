import { SaleDTO, SaleService } from "../../application";
import { BaseController } from "./base.controller";
import { SaleEntity } from "../../domain";

export class SaleController extends BaseController<SaleEntity, SaleDTO> {
  protected resource = "sales";
  protected path = "/sales";
  constructor(protected service: SaleService) {
    super(service, SaleDTO);
  }
}
