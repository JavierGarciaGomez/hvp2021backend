import { CustomQueryOptions } from "../../shared/interfaces";

export abstract class BaseDatasource<T> {
  abstract create(entity: T): Promise<T>;
  abstract getAll(queryOptions: CustomQueryOptions): Promise<T[]>;
  abstract getById(id: string): Promise<T | null>;
  abstract update(id: string, entity: T): Promise<T>;
  abstract delete(id: string): Promise<string>;
  abstract count(queryOptions: CustomQueryOptions): Promise<number>;
  abstract createMany(entities: T[]): Promise<T[]>;
  abstract exists(query: any): Promise<boolean>;
}
