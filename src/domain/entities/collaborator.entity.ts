import { ICollaborator } from "../../infra/db/mongo/models/collaborator.model";
import { BaseEntity } from "./base.entity";

export interface Options {
  id?: string;
  name: string;
  email: string;
  position: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export class CollaboratorEntity implements BaseEntity {
  id?: string;
  name: string;
  email: string;
  position: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(options: Options) {
    this.name = options.name;
    this.email = options.email;
    this.position = options.position;
    this.id = options.id;
    this.createdAt = options.createdAt;
    this.updatedAt = options.updatedAt;
    this.createdBy = options.createdBy;
    this.updatedBy = options.updatedBy;
  }

  public static fromDocument(document: ICollaborator): CollaboratorEntity {
    return new CollaboratorEntity({
      id: document.id,
      name: document.name,
      email: document.email,
      position: document.position,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      createdBy: document.createdBy,
      updatedBy: document.updatedBy,
    });
  }
}
