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

export abstract class BaseService<T extends BaseEntity | BaseVO, DTO, R = T> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected readonly entityClass:
      | BaseEntityConstructor<T>
      | BaseVOConstructor<T>
  ) {}

  public create = async (
    dto: DTO,
    authUser?: AuthenticatedCollaborator
  ): Promise<R> => {
    const entity = new this.entityClass(dto);
    const result = await this.repository.create(entity);
    return this.transformToResponse(result);
  };

  async getAll(queryOptions?: CustomQueryOptions): Promise<R[]> {
    const data = await this.repository.getAll(queryOptions);
    return await Promise.all(data.map(this.transformToResponse));
  }

  async getById(id: string): Promise<R> {
    const entity = await this.repository.getById(id);
    if (!entity) {
      throw BaseError.notFound(`${this.getResourceName()} not found`);
    }
    return this.transformToResponse(entity);
  }

  async update(
    id: string,
    dto: DTO,
    authUser?: AuthenticatedCollaborator
  ): Promise<R> {
    const entity = new this.entityClass(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  }

  async delete(id: string): Promise<string> {
    return await this.repository.delete(id);
  }

  async count(queryOptions: CustomQueryOptions): Promise<number> {
    return await this.repository.count(queryOptions);
  }

  async updateMany(entities: T[]): Promise<R[]> {
    const result = await this.repository.updateMany(entities);
    return await Promise.all(result.map(this.transformToResponse));
  }

  async createMany(entities: T[]): Promise<R[]> {
    const result = await this.repository.createMany(entities);
    return await Promise.all(result.map(this.transformToResponse));
  }

  async deleteMany(ids: string[]): Promise<string[]> {
    return await this.repository.deleteMany(ids);
  }

  public abstract getResourceName(): string;

  transformToResponse = async (entity: T): Promise<R> => {
    return entity as unknown as R;
  };
}
