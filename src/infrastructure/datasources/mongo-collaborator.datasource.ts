import { CollaboratorDatasource } from "../../domain/datasources/collaborator.datasource";
import { CollaboratorEntity } from "../../domain/entities/collaborator.entity";
import { BaseError } from "../../shared/errors/BaseError";
import { CollaboratorModel } from "../db/mongo/models/collaborator.model";
export class MongoCollaboratorDataSource implements CollaboratorDatasource {
  constructor() {}
  async getById(id: string): Promise<CollaboratorEntity> {
    const collaborator = await CollaboratorModel.findById(id);
    if (!collaborator) {
      throw BaseError.notFound("Collaborator not found.");
    }
    return CollaboratorEntity.fromDocument(collaborator);
  }

  async getAll(): Promise<CollaboratorEntity[]> {
    const collaborators = await CollaboratorModel.find();
    return collaborators.map((collaborator) =>
      CollaboratorEntity.fromDocument(collaborator)
    );
  }
  async create(collaborator: CollaboratorEntity): Promise<CollaboratorEntity> {
    const newCollaborator = new CollaboratorModel(collaborator);
    await newCollaborator.save();
    return newCollaborator;
  }

  async update(collaborator: CollaboratorEntity): Promise<CollaboratorEntity> {
    const updatedCollaborator = await CollaboratorModel.findByIdAndUpdate(
      collaborator.id,
      {
        ...collaborator,
      },
      { new: true }
    );

    if (!updatedCollaborator) {
      throw new Error("Collaborator not found.");
    }

    return CollaboratorEntity.fromDocument(updatedCollaborator);
  }

  async delete(id: string): Promise<string> {
    const result = await CollaboratorModel.findByIdAndDelete(id);
    if (!result) {
      throw new Error("Collaborator not found.");
    }
    return id;
  }
}
