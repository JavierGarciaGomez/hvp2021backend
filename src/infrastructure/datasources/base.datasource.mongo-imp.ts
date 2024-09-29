import { Model } from "mongoose";
import { BaseError, CustomQueryOptions } from "../../shared";
import { getAllHelper } from "../../shared/helpers";
import {
  BaseDatasource,
  BaseEntity,
  BaseEntityConstructor,
  BaseVO,
} from "../../domain";

export abstract class BaseDatasourceMongoImp<T extends BaseEntity>
  implements BaseDatasource<T>
{
  constructor(
    protected readonly model: Model<any>,
    protected readonly entity: BaseEntityConstructor<T>
  ) {}
  async getAll(queryOptions: CustomQueryOptions): Promise<T[]> {
    const result = await getAllHelper(this.model, queryOptions);
    return result.map(this.entity.fromDocument);
  }

  async getById(id: string): Promise<T | null> {
    const entity = await this.model.findById(id);
    if (!entity) {
      return null;
    }
    return this.entity.fromDocument(entity);
  }

  async create(entity: T): Promise<T> {
    const createdEntity = await this.model.create(entity);
    await createdEntity.save();
    return this.entity.fromDocument(createdEntity);
  }

  async update(id: string, entity: T): Promise<T> {
    const updatedEntity = await this.model.findByIdAndUpdate(id, entity, {
      new: true,
    });

    if (!updatedEntity) {
      throw BaseError.notFound("Entity not found");
    }
    return this.entity.fromDocument(updatedEntity);
  }

  async delete(id: string): Promise<string> {
    const deletedEntity = await this.model.findByIdAndDelete(id);
    if (!deletedEntity) {
      throw BaseError.notFound("Entity not found");
    }
    return id;
  }

  async count(queryOptions?: CustomQueryOptions): Promise<number> {
    const { filteringDto } = queryOptions || {};

    return this.model.countDocuments(filteringDto || {});
  }

  async exists(query: any): Promise<boolean> {
    const result = await this.model.findOne(query);
    return result !== null;
  }

  async createMany(entities: T[]): Promise<T[]> {
    const createdEntities = await this.model.insertMany(entities);
    return createdEntities.map(this.entity.fromDocument);
  }

  async updateMany(entities: T[]): Promise<T[]> {
    const updatedEntities = await Promise.all(
      entities.map(async (entity) => {
        const updatedEntity = await this.model.findByIdAndUpdate(
          entity.id,
          entity,
          {
            new: true,
          }
        );
        if (!updatedEntity) {
          throw BaseError.notFound("Entity not found");
        }
        return this.entity.fromDocument(updatedEntity);
      })
    );
    return updatedEntities;
  }
}
