import { ProductDTO, ProductService } from "../../application";
import { BaseController } from "./base.controller";
import { ProductEntity } from "../../domain";

export class ProductController extends BaseController<
  ProductEntity,
  ProductDTO
> {
  protected resource = "product";
  protected path = "/products";
  constructor(protected service: ProductService) {
    super(service, ProductDTO);
  }
}
