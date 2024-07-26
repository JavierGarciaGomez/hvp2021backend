import { CollaboratorDatasource } from "../../domain/datasources/collaborator.datasource";
import { CollaboratorEntity, PublicCollaborator } from "../../domain/entities";
import { CollaboratorRepository } from "../../domain/repositories";
import { CustomQueryOptions } from "../../shared/interfaces";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class CollaboratorRepositoryImpl
  extends BaseRepositoryImpl<CollaboratorEntity>
  implements CollaboratorRepository
{
  constructor(protected readonly datasource: CollaboratorDatasource) {
    super(datasource);
  }
  async register(
    collaborator: Partial<CollaboratorEntity>
  ): Promise<CollaboratorEntity> {
    return await this.datasource.register(collaborator);
  }
  async getAllForWeb(
    options: CustomQueryOptions
  ): Promise<PublicCollaborator[]> {
    return await this.datasource.getAllForWeb(options);
  }
}
