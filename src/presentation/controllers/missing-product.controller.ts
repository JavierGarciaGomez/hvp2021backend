import { MissingProductDTO, MissingProductService } from "../../application";
import { BaseController } from "./base.controller";
import { MissingProductEntity } from "../../domain";

export class MissingProductController extends BaseController<
  MissingProductEntity,
  MissingProductDTO
> {
  protected resource = "missing-product";
  protected path = "/missing-products";
  constructor(protected service: MissingProductService) {
    super(service, MissingProductDTO);
  }
}
