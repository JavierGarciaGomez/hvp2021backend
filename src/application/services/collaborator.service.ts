import { CollaboratorEntity, PublicCollaborator } from "../../domain/entities";
import { CollaboratorRepository } from "../../domain/repositories";
import { bcryptAdapter } from "../../infrastructure/adapters";

import { CustomQueryOptions } from "../../shared/interfaces";

import { CollaboratorDTO } from "../dtos";
import { BaseService } from "./base.service";

export class CollaboratorService extends BaseService<
  CollaboratorEntity,
  CollaboratorDTO
> {
  constructor(protected repository: CollaboratorRepository) {
    super(repository, CollaboratorEntity);
  }

  public count = async (): Promise<number> => {
    return await this.repository.count();
  };

  public getAllPublic = async (
    options: CustomQueryOptions
  ): Promise<PublicCollaborator[]> => {
    return await this.repository.getAllForWeb(options);
  };

  public register = async (
    dto: Partial<CollaboratorDTO>
  ): Promise<CollaboratorEntity> => {
    return await this.repository.register(dto);
  };

  public update = async (
    id: string,
    dto: CollaboratorDTO
  ): Promise<CollaboratorEntity> => {
    if (dto.password) dto.password = bcryptAdapter.hash(dto.password);
    const collaborator = new CollaboratorEntity(dto);
    return await this.repository.update(id, collaborator);
  };
}
