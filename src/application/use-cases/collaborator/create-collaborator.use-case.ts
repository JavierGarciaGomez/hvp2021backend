import { CreateCollaboratorDto } from "./../../dtos/collaborator/create-collaborator.dto";
import { CollaboratorRepository } from "../../../domain/repositories/";

export class CreateCollaborator {
  constructor(private repository: CollaboratorRepository) {}

  async execute(createCollaboratorDto: CreateCollaboratorDto) {
    return await this.repository.create(createCollaboratorDto);
  }
}
