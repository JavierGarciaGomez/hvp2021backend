import { BaseDatasource } from "../../domain";

import { BaseEntity } from "../../domain/entities";
import { BaseRepository } from "../../domain/repositories";
import { CustomQueryOptions } from "../../shared/interfaces";
import { ClientSession } from "mongoose";

export abstract class BaseRepositoryImpl<T extends BaseEntity>
  implements BaseRepository<T>
{
  constructor(protected readonly datasource: BaseDatasource<T>) {}

  async getAll(
    queryOptions: CustomQueryOptions,
    session?: ClientSession
  ): Promise<T[]> {
    return await this.datasource.getAll(queryOptions, session);
  }
  async create(entity: T, session?: ClientSession): Promise<T> {
    return await this.datasource.create(entity, session);
  }

  async getById(id: string, session?: ClientSession): Promise<T | null> {
    return await this.datasource.getById(id, session);
  }

  async update(id: string, entity: T, session?: ClientSession): Promise<T> {
    return await this.datasource.update(id, entity, session);
  }

  async delete(id: string, session?: ClientSession): Promise<string> {
    return await this.datasource.delete(id, session);
  }

  async count(
    queryOptions: CustomQueryOptions,
    session?: ClientSession
  ): Promise<number> {
    return await this.datasource.count(queryOptions, session);
  }

  async exists(query: any, session?: ClientSession): Promise<boolean> {
    return await this.datasource.exists(query, session);
  }

  async createMany(entities: T[], session?: ClientSession): Promise<T[]> {
    return await this.datasource.createMany(entities, session);
  }

  async updateMany(entities: T[], session?: ClientSession): Promise<T[]> {
    return await this.datasource.updateMany(entities, session);
  }

  async deleteMany(ids: string[], session?: ClientSession): Promise<string[]> {
    return await this.datasource.deleteMany(ids, session);
  }
}
