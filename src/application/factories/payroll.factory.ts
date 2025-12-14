import {
  PayrollDatasourceMongoImp,
  PayrollRepositoryImpl,
} from "../../infrastructure";

import { PayrollService } from "../services";

export const createPayrollService = () => {
  const repository = createPayrollRepository();
  const service = new PayrollService(repository);

  return service;
};

export const createPayrollRepository = () => {
  const datasource = new PayrollDatasourceMongoImp();
  const repository = new PayrollRepositoryImpl(datasource);

  return repository;
};
