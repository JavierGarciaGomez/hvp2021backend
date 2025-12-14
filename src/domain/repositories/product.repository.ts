import { ProductEntity } from "../entities";
import { BaseRepository } from "./base.repository";

export abstract class ProductRepository extends BaseRepository<ProductEntity> {}
