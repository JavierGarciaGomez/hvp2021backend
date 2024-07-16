import { CreateCollaboratorDto } from "../../application/dtos";
import { CollaboratorDatasource } from "../../domain/datasources/collaborator.datasource";
import { CollaboratorEntity } from "../../domain/entities";
import { CollaboratorRepository } from "../../domain/repositories";

export class CollaboratorRepositoryImpl implements CollaboratorRepository {
  constructor(private readonly datasource: CollaboratorDatasource) {}
  getById(id: string): Promise<CollaboratorEntity> {
    return this.datasource.getById(id);
  }
  getAll(): Promise<CollaboratorEntity[]> {
    return this.datasource.getAll();
  }
  create(collaborator: CreateCollaboratorDto): Promise<CollaboratorEntity> {
    return this.datasource.create(new CollaboratorEntity(collaborator));
  }
  update(collaborator: CollaboratorEntity): Promise<CollaboratorEntity> {
    return this.datasource.update(collaborator);
  }
  delete(id: string): Promise<string> {
    return this.datasource.delete(id);
  }
}
