import { CollaboratorEntity } from "../../domain/entities";
import { CollaboratorRepository } from "../../domain/repositories";
import { Email } from "../../domain/value-objects/email.value-object";
import { CollaboratorDTO } from "../dtos";
import { CreateCollaborator } from "../use-cases/collaborator/create-collaborator.use-case";

export class CollaboratorService {
  constructor(private createCollaboratorUseCase: CreateCollaborator) {}

  async createCollaborator(dto: CollaboratorDTO): Promise<void> {
    const email = new Email(dto.email);
    const collaborator = new CollaboratorEntity({
      name: dto.name,
      email: email.getValue(),
      position: dto.position,
    });
    await this.createCollaboratorUseCase.execute(collaborator);
  }

  //   async getCollaborator(id: string): Promise<CollaboratorDTO | null> {
  //     const collaborator = await this.collaboratorRepository.findById(id);
  //     if (!collaborator) return null;
  //     return {
  //       id: collaborator.getId(),
  //       name: collaborator.getName(),
  //       email: collaborator.getEmail().getValue(),
  //     };
  //   }

  //   async updateCollaborator(dto: CollaboratorDTO): Promise<void> {
  //     const collaborator = await this.collaboratorRepository.findById(dto.id);
  //     if (!collaborator) throw new Error("Collaborator not found");
  //     collaborator.changeName(dto.name);
  //     collaborator.changeEmail(new Email(dto.email));
  //     await this.collaboratorRepository.update(collaborator);
  //   }
}
