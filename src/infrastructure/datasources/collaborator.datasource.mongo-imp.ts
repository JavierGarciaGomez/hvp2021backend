import {
  CollaboratorDatasource,
  CollaboratorEntity,
  PublicCollaborator,
} from "../../domain";
import { BaseError } from "../../shared";
import { getAllHelper } from "../../shared/helpers";
import { CustomQueryOptions } from "../../shared/interfaces";
import { CollaboratorModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo";

export class CollaboratorDataSourceMongoImp
  extends BaseDatasourceMongoImp<CollaboratorEntity>
  implements CollaboratorDatasource
{
  constructor() {
    super(CollaboratorModel, CollaboratorEntity);
  }

  async register(
    collaboratorArg: Partial<CollaboratorEntity>
  ): Promise<CollaboratorEntity> {
    const usedEmail = await CollaboratorModel.findOne({
      email: collaboratorArg.email,
    });
    if (usedEmail) {
      throw BaseError.conflict("Email already in use");
    }

    const resource = await CollaboratorModel.findOne({
      col_code: collaboratorArg.col_code,
    });

    if (!resource) {
      throw BaseError.notFound(
        "Resource not found with provided collaborator code"
      );
    }

    if (resource.isRegistered) {
      throw BaseError.conflict("Collaborator already registered");
    }

    if (resource.accessCode !== collaboratorArg.accessCode) {
      throw BaseError.unauthorized("Invalid access code");
    }

    resource.email = collaboratorArg.email;
    resource.isRegistered = true;
    resource.registeredDate = new Date();

    const updated = await CollaboratorModel.findByIdAndUpdate(
      resource._id,
      resource,
      { new: true }
    );

    if (!updated) {
      throw BaseError.internalServer("Error registering collaborator");
    }

    return CollaboratorEntity.fromDocument(updated);
  }

  async getAllForWeb(
    options: CustomQueryOptions
  ): Promise<PublicCollaborator[]> {
    const result = await getAllHelper(CollaboratorModel, options);
    return result.map((collaborator) =>
      CollaboratorEntity.fromDocument(collaborator).toPublicCollaborator()
    );
  }

  async create(collaborator: CollaboratorEntity): Promise<CollaboratorEntity> {
    const existingCollaborator = await this.exists({
      $or: [
        { col_code: collaborator.col_code },
        { email: { $exists: true, $ne: "", $eq: collaborator.email } },
      ],
    });

    if (existingCollaborator) {
      throw BaseError.conflict(
        "Collaborator with the same col_code or email already exists"
      );
    }
    const newCollaborator = new CollaboratorModel(collaborator);
    await newCollaborator.save();
    return CollaboratorEntity.fromDocument(newCollaborator);
  }

  async count(): Promise<number> {
    return CollaboratorModel.countDocuments();
  }
}
