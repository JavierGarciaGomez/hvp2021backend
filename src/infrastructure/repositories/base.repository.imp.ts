import { BaseDatasource } from "../../domain";

import { BaseEntity } from "../../domain/entities";
import { BaseRepository } from "../../domain/repositories";
import { CustomQueryOptions } from "../../shared/interfaces";

export abstract class BaseRepositoryImpl<T extends BaseEntity>
  implements BaseRepository<T>
{
  constructor(protected readonly datasource: BaseDatasource<T>) {}

  async getAll(queryOptions: CustomQueryOptions): Promise<T[]> {
    return await this.datasource.getAll(queryOptions);
  }
  async create(entity: T): Promise<T> {
    return await this.datasource.create(entity);
  }

  async getById(id: string): Promise<T | null> {
    return await this.datasource.getById(id);
  }

  async update(id: string, entity: T): Promise<T> {
    return await this.datasource.update(id, entity);
  }

  async delete(id: string): Promise<string> {
    return await this.datasource.delete(id);
  }

  async count(queryOptions: CustomQueryOptions): Promise<number> {
    return await this.datasource.count(queryOptions);
  }

  async exists(query: any): Promise<boolean> {
    return await this.datasource.exists(query);
  }

  async createMany(entities: T[]): Promise<T[]> {
    return await this.datasource.createMany(entities);
  }

  async updateMany(entities: T[]): Promise<T[]> {
    return await this.datasource.updateMany(entities);
  }

  async deleteMany(ids: string[]): Promise<string[]> {
    return await this.datasource.deleteMany(ids);
  }
}
