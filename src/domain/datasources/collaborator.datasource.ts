import { CollaboratorEntity } from "../entities/collaborator.entity";

export abstract class CollaboratorDatasource {
  abstract getById(id: string): Promise<CollaboratorEntity>;
  abstract getAll(): Promise<CollaboratorEntity[]>;
  abstract create(
    collaborator: CollaboratorEntity
  ): Promise<CollaboratorEntity>;
  abstract update(
    collaborator: CollaboratorEntity
  ): Promise<CollaboratorEntity>;
  abstract delete(id: string): Promise<string>;
}
