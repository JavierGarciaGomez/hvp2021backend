import {
  ActivityRegisterDataSourceMongoImp,
  ActivityRegisterRepositoryImp,
} from "../../infrastructure";
import { ActivityRegisterService } from "../services";

export const createActivityRegisterService = () => {
  const repository = createActivityRegisterRepository();
  const service = new ActivityRegisterService(repository);

  return service;
};

export const createActivityRegisterRepository = () => {
  const datasource = new ActivityRegisterDataSourceMongoImp();
  const repository = new ActivityRegisterRepositoryImp(datasource);

  return repository;
};
