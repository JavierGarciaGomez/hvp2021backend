import {
  ActivityRegisterTypeDatasourceMongoImp,
  ActivityRegisterTypeRepositoryImp,
} from "../../infrastructure";

import { ActivityRegisterTypeService } from "../services";

export const createActivityRegisterTypeService = () => {
  const repository = createActivityRegisterTypeRepository();
  const service = new ActivityRegisterTypeService(repository);

  return service;
};

export const createActivityRegisterTypeRepository = () => {
  const datasource = new ActivityRegisterTypeDatasourceMongoImp();
  const repository = new ActivityRegisterTypeRepositoryImp(datasource);

  return repository;
};
