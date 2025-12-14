import {
  EmploymentDatasourceMongoImp,
  EmploymentRepositoryImpl,
} from "../../infrastructure";

import { EmploymentService } from "../services";

export const createEmploymentService = () => {
  const repository = createEmploymentRepository();
  const service = new EmploymentService(repository);

  return service;
};

export const createEmploymentRepository = () => {
  const datasource = new EmploymentDatasourceMongoImp();
  const repository = new EmploymentRepositoryImpl(datasource);

  return repository;
};
