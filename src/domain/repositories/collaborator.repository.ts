import { CustomQueryOptions } from "../../shared/interfaces";
import { CollaboratorEntity, PublicCollaborator } from "../entities/";
import { BaseRepository } from "./base.repository";

export abstract class CollaboratorRepository extends BaseRepository<CollaboratorEntity> {
  abstract register(
    collaborator: Partial<CollaboratorEntity>
  ): Promise<CollaboratorEntity>;
  abstract getAllForWeb(
    options: CustomQueryOptions
  ): Promise<PublicCollaborator[]>;
  abstract delete(id: string): Promise<string>;
  abstract count(): Promise<number>;
}
