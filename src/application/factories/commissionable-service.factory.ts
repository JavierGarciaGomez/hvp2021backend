import {
  CommissionableServiceDatasourceMongoImp,
  CommissionableServiceRepositoryImpl,
} from "../../infrastructure";

import { CommissionableServiceService } from "../services";

export const createCommissionableServiceService = () => {
  const repository = createCommissionableServiceRepository();
  const service = new CommissionableServiceService(repository);

  return service;
};

export const createCommissionableServiceRepository = () => {
  const datasource = new CommissionableServiceDatasourceMongoImp();
  const repository = new CommissionableServiceRepositoryImpl(datasource);

  return repository;
};
