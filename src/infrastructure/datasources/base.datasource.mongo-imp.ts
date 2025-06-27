import { Model, ClientSession } from "mongoose";
import { BaseError, CustomQueryOptions } from "../../shared";
import { getAllHelper } from "../../shared/helpers";
import {
  BaseDatasource,
  BaseEntity,
  BaseEntityConstructor,
} from "../../domain";

export abstract class BaseDatasourceMongoImp<T extends BaseEntity>
  implements BaseDatasource<T>
{
  constructor(
    protected readonly model: Model<any>,
    protected readonly entity: BaseEntityConstructor<T>
  ) {}
  async getAll(
    queryOptions: CustomQueryOptions,
    session?: ClientSession
  ): Promise<T[]> {
    const result = await getAllHelper(this.model, queryOptions, session);
    return result.map(this.entity.fromDocument);
  }

  async getById(id: string, session?: ClientSession): Promise<T | null> {
    const entity = await this.model.findById(id).session(session || null);
    if (!entity) {
      return null;
    }
    return this.entity.fromDocument(entity);
  }

  async create(entity: T, session?: ClientSession): Promise<T> {
    const createdEntity = await this.model.create([entity], { session });
    return this.entity.fromDocument(createdEntity[0]);
  }

  async update(id: string, entity: T, session?: ClientSession): Promise<T> {
    const updatedEntity = await this.model.findByIdAndUpdate(id, entity, {
      new: true,
      session,
    });

    if (!updatedEntity) {
      throw BaseError.notFound("Entity not found");
    }
    return this.entity.fromDocument(updatedEntity);
  }

  async delete(id: string, session?: ClientSession): Promise<string> {
    const deletedEntity = await this.model.findByIdAndDelete(id, { session });
    if (!deletedEntity) {
      throw BaseError.notFound("Entity not found");
    }
    return id;
  }

  async count(
    queryOptions?: CustomQueryOptions,
    session?: ClientSession
  ): Promise<number> {
    const { filteringDto } = queryOptions || {};

    return this.model
      .countDocuments(filteringDto || {})
      .session(session || null);
  }

  async exists(query: any, session?: ClientSession): Promise<boolean> {
    const result = await this.model.findOne(query).session(session || null);
    return result !== null;
  }

  async createMany(entities: T[], session?: ClientSession): Promise<T[]> {
    const createdEntities = await this.model.insertMany(entities, { session });
    return createdEntities.map(this.entity.fromDocument);
  }

  async updateMany(entities: T[], session?: ClientSession): Promise<T[]> {
    const updatedEntities = await Promise.all(
      entities.map(async (entity) => {
        const updatedEntity = await this.model.findByIdAndUpdate(
          entity.id,
          entity,
          {
            new: true,
            session,
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

  async deleteMany(ids: string[], session?: ClientSession): Promise<string[]> {
    const deletedEntities = await this.model.deleteMany(
      { _id: { $in: ids } },
      { session }
    );
    return ids;
  }
}
