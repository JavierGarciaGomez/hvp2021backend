import {
  CollaboratorDataSourceMongoImp,
  CollaboratorRepositoryImpl,
} from "../../infrastructure";
import { CollaboratorService } from "../services";

export const createCollaboratorService = () => {
  const datasource = new CollaboratorDataSourceMongoImp();
  const repository = new CollaboratorRepositoryImpl(datasource);
  const service = new CollaboratorService(repository);

  return service;
};
