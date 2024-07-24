import { CollaboratorRepositoryImpl } from "./../../infra/repositories/collaborator.repository.impl";
import { Router } from "express";
import { CollaboratorsController } from "./";
import { CollaboratorService } from "../../application/services/collaborator.service";
import { CreateCollaborator } from "../../application/use-cases/collaborator/create-collaborator.use-case";
import { MongoCollaboratorDataSource } from "../../infra/datasources/mongo-collaborator.datasource";
import { create } from "domain";

export class CollaboratorRoutes {
  constructor() {}

  static get routes(): Router {
    const router = Router();
    const dataSource = new MongoCollaboratorDataSource();
    const repository = new CollaboratorRepositoryImpl(dataSource);
    const createUseCase = new CreateCollaborator(repository);
    const service = new CollaboratorService(createUseCase);
    const controller = new CollaboratorsController(service);

    router.post("/", controller.create);

    return router;
  }
}
