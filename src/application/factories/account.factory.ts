import {
  AccountDatasourceMongoImp,
  AccountRepositoryImpl,
} from "../../infrastructure";

import { AccountService } from "../services";

export const createAccountService = () => {
  const repository = createAccountRepository();
  const service = new AccountService(repository);

  return service;
};

export const createAccountRepository = () => {
  const datasource = new AccountDatasourceMongoImp();
  const repository = new AccountRepositoryImpl(datasource);

  return repository;
};
