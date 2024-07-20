import { Request, Response } from "express";

import { RegisterCollaboratorDTO } from "../../application/dtos";
import { CollaboratorService } from "../../application/services/collaborator.service";

export class CollaboratorsController {
  constructor(private createCollaboratorService: CollaboratorService) {}

  async create(req: Request, res: Response): Promise<void> {
    const body: RegisterCollaboratorDTO = req.body;

    await this.createCollaboratorService.createCollaborator(body);
    res.status(201).send();
  }
}
