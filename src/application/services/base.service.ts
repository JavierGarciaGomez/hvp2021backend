import {
  BaseEntity,
  BaseEntityConstructor,
  BaseRepository,
} from "../../domain";
import { CustomQueryOptions } from "../../shared/interfaces";

export abstract class BaseService<T extends BaseEntity, DTO> {
  constructor(
    protected readonly repository: BaseRepository<T>,
    protected readonly entityClass: BaseEntityConstructor<T>
  ) {}

  public create = async (dto: DTO): Promise<T> => {
    const entity = new this.entityClass(dto);
    return await this.repository.create(entity);
  };

  async getAll(queryOptions: CustomQueryOptions): Promise<T[]> {
    return await this.repository.getAll(queryOptions);
  }

  async getById(id: string): Promise<T> {
    return await this.repository.getById(id);
  }

  async update(id: string, dto: DTO): Promise<T> {
    const entity = new this.entityClass(dto);
    return await this.repository.update(id, entity);
  }

  async delete(id: string): Promise<string> {
    return await this.repository.delete(id);
  }

  async count(): Promise<number> {
    return await this.repository.count();
  }
}
