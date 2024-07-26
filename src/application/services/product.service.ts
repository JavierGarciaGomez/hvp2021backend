import { ProductEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { ProductRepository } from "../../domain";
import { ProductDTO } from "../dtos";

export class ProductService extends BaseService<ProductEntity, ProductDTO> {
  constructor(protected readonly repository: ProductRepository) {
    super(repository, ProductEntity);
  }

  protected getResourceName(): string {
    return "product";
  }
}
