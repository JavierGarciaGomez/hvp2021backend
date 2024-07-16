import { Request, Response } from "express";

import { CollaboratorDTO } from "../../application/dtos";
import { CollaboratorService } from "../../application/services/collaborator.service";

export class CollaboratorsController {
  constructor(private createCollaboratorService: CollaboratorService) {}

  async create(req: Request, res: Response): Promise<void> {
    const body: CollaboratorDTO = req.body;

    await this.createCollaboratorService.createCollaborator(body);
    res.status(201).send();
  }
}
