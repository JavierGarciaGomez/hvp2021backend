import { CustomQueryOptions } from "../../shared/interfaces";
import { ClientSession } from "mongoose";

export abstract class BaseDatasource<T> {
  abstract create(entity: T, session?: ClientSession): Promise<T>;
  abstract getAll(
    queryOptions: CustomQueryOptions,
    session?: ClientSession
  ): Promise<T[]>;
  abstract getById(id: string, session?: ClientSession): Promise<T | null>;
  abstract update(id: string, entity: T, session?: ClientSession): Promise<T>;
  abstract delete(id: string, session?: ClientSession): Promise<string>;
  abstract count(
    queryOptions?: CustomQueryOptions,
    session?: ClientSession
  ): Promise<number>;
  abstract createMany(entities: T[], session?: ClientSession): Promise<T[]>;
  abstract updateMany(entities: T[], session?: ClientSession): Promise<T[]>;
  abstract deleteMany(
    ids: string[],
    session?: ClientSession
  ): Promise<string[]>;
  abstract exists(query: any, session?: ClientSession): Promise<boolean>;
}
