import {
  CollaboratorDataSourceMongoImp,
  CollaboratorRepositoryImpl,
} from "../../infrastructure";

import { CollaboratorService } from "../services";

export const createCollaboratorService = () => {
  const repository = createCollaboratorRepository();
  const service = new CollaboratorService(repository);

  return service;
};

export const createCollaboratorRepository = () => {
  const datasource = new CollaboratorDataSourceMongoImp();
  const repository = new CollaboratorRepositoryImpl(datasource);

  return repository;
};
