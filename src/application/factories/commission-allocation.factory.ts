import {
  CommissionAllocationDatasourceMongoImp,
  CommissionAllocationRepositoryImpl,
} from "../../infrastructure";

import { CommissionAllocationService } from "../services";

export const createCommissionAllocationService = () => {
  const repository = createCommissionAllocationRepository();
  const service = new CommissionAllocationService(repository);

  return service;
};

export const createCommissionAllocationRepository = () => {
  const datasource = new CommissionAllocationDatasourceMongoImp();
  const repository = new CommissionAllocationRepositoryImpl(datasource);

  return repository;
};
