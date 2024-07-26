import { ProductDTO, ProductService } from "../../application";
import { BaseController } from "./base.controller";
import { ProductEntity } from "../../domain";

export class ProductController extends BaseController<
  ProductEntity,
  ProductDTO
> {
  protected resource = "notification";
  protected path = "/notifications";
  constructor(protected service: ProductService) {
    super(service, ProductDTO);
  }
}
