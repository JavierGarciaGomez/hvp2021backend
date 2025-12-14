import { MissingProductEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { MissingProductRepository } from "../../domain";
import { MissingProductDTO } from "../dtos";

export class MissingProductService extends BaseService<
  MissingProductEntity,
  MissingProductDTO
> {
  constructor(protected readonly repository: MissingProductRepository) {
    super(repository, MissingProductEntity);
  }

  public getResourceName(): string {
    return "missing-product";
  }
}
