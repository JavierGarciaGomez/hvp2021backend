import {
  SimplifiedBranchCashReconciliationDatasourceMongoImp,
  SimplifiedBranchCashReconciliationRepositoryImpl,
} from "../../infrastructure";

import { SimplifiedBranchCashReconciliationService } from "../services";

export const createSimplifiedBranchCashReconciliationService = () => {
  const repository = createSimplifiedBranchCashReconciliationRepository();
  const service = new SimplifiedBranchCashReconciliationService(repository);

  return service;
};

export const createSimplifiedBranchCashReconciliationRepository = () => {
  const datasource = new SimplifiedBranchCashReconciliationDatasourceMongoImp();
  const repository = new SimplifiedBranchCashReconciliationRepositoryImpl(
    datasource
  );

  return repository;
};
