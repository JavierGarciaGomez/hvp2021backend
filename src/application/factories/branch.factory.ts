import {
  BranchDatasourceMongoImp,
  BranchRepositoryImpl,
} from "../../infrastructure";

import { BranchService } from "../services";

export const createBranchService = () => {
  const repository = createBranchRepository();
  const service = new BranchService(repository);

  return service;
};

export const createBranchRepository = () => {
  const datasource = new BranchDatasourceMongoImp();
  const repository = new BranchRepositoryImpl(datasource);

  return repository;
};
