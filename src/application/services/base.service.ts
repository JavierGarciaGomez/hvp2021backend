import {
  BaseEntity,
  BaseEntityConstructor,
  BaseRepository,
  BaseVO,
  BaseVOConstructor,
} from "../../domain";

import { BaseError } from "../../shared";
import {
  AuthenticatedCollaborator,
  CustomQueryOptions,
} from "../../shared/interfaces";
import { ClientSession } from "mongoose";

export abstract class BaseService<T extends BaseEntity | BaseVO, DTO, R = T> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected readonly entityClass:
      | BaseEntityConstructor<T>
      | BaseVOConstructor<T>
  ) {}

  public create = async (
    dto: DTO,
    authUser?: AuthenticatedCollaborator,
    session?: ClientSession
  ): Promise<R> => {
    const entity = new this.entityClass(dto);
    const result = await this.repository.create(entity, session);
    return this.transformToResponse(result);
  };

  async getAll(
    queryOptions?: CustomQueryOptions,
    session?: ClientSession
  ): Promise<R[]> {
    const data = await this.repository.getAll(queryOptions, session);
    return await Promise.all(data.map(this.transformToResponse));
  }

  async getById(id: string, session?: ClientSession): Promise<R> {
    const entity = await this.repository.getById(id, session);
    if (!entity) {
      throw BaseError.notFound(`${this.getResourceName()} not found`);
    }
    return this.transformToResponse(entity);
  }

  async update(
    id: string,
    dto: DTO,
    authUser?: AuthenticatedCollaborator,
    session?: ClientSession
  ): Promise<R> {
    const entity = new this.entityClass(dto);
    const result = await this.repository.update(id, entity, session);
    return this.transformToResponse(result);
  }

  async delete(id: string, session?: ClientSession): Promise<string> {
    return await this.repository.delete(id, session);
  }

  async count(
    queryOptions: CustomQueryOptions,
    session?: ClientSession
  ): Promise<number> {
    return await this.repository.count(queryOptions, session);
  }

  async updateMany(entities: T[], session?: ClientSession): Promise<R[]> {
    const result = await this.repository.updateMany(entities, session);
    return await Promise.all(result.map(this.transformToResponse));
  }

  async createMany(entities: T[], session?: ClientSession): Promise<R[]> {
    const result = await this.repository.createMany(entities, session);
    return await Promise.all(result.map(this.transformToResponse));
  }

  async deleteMany(ids: string[], session?: ClientSession): Promise<string[]> {
    return await this.repository.deleteMany(ids, session);
  }

  public abstract getResourceName(): string;

  transformToResponse = async (entity: T): Promise<R> => {
    return entity as unknown as R;
  };
}
