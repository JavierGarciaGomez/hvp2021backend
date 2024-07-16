import { CreateCollaboratorDto } from "../../application/dtos";
import { CollaboratorEntity } from "../entities/";

export abstract class CollaboratorRepository {
  abstract getById(id: string): Promise<CollaboratorEntity>;
  abstract getAll(): Promise<CollaboratorEntity[]>;
  abstract create(
    collaborator: CreateCollaboratorDto
  ): Promise<CollaboratorEntity>;
  abstract update(
    collaborator: CollaboratorEntity
  ): Promise<CollaboratorEntity>;
  abstract delete(id: string): Promise<string>;
}
