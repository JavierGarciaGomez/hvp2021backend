import { CustomQueryOptions } from "../../shared/interfaces";
import {
  CollaboratorEntity,
  PublicCollaborator,
} from "../entities/collaborator.entity";
import { BaseDatasource } from "./";

export abstract class CollaboratorDatasource extends BaseDatasource<CollaboratorEntity> {
  abstract register(
    collaborator: Partial<CollaboratorEntity>
  ): Promise<CollaboratorEntity>;
  abstract getAllForWeb(
    options: CustomQueryOptions
  ): Promise<PublicCollaborator[]>;
}
