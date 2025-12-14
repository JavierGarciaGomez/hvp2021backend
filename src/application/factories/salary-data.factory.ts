import {
  SalaryDataDatasourceMongoImp,
  SalaryDataRepositoryImpl,
} from "../../infrastructure";

import { SalaryDataService } from "../services";

export const createSalaryDataService = () => {
  const repository = createSalaryDataRepository();
  const service = new SalaryDataService(repository);

  return service;
};

export const createSalaryDataRepository = () => {
  const datasource = new SalaryDataDatasourceMongoImp();
  const repository = new SalaryDataRepositoryImpl(datasource);

  return repository;
};
