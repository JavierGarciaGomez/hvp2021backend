import {
  BranchCashReconciliationDatasourceMongoImp,
  BranchCashReconciliationRepositoryImpl,
} from "../../infrastructure";

import { BranchCashReconciliationService } from "../services";

export const createBranchCashReconciliationService = () => {
  const repository = createBranchCashReconciliationRepository();
  const service = new BranchCashReconciliationService(repository);

  return service;
};

export const createBranchCashReconciliationRepository = () => {
  const datasource = new BranchCashReconciliationDatasourceMongoImp();
  const repository = new BranchCashReconciliationRepositoryImpl(datasource);

  return repository;
};
