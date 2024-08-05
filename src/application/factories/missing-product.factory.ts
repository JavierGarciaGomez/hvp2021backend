import {
  MissingProductDatasourceMongoImp,
  MissingProductRepositoryImp,
} from "../../infrastructure";

import { MissingProductService } from "../services";

export const createMissingProductService = () => {
  const repository = createMissingProductRepository();
  const service = new MissingProductService(repository);

  return service;
};

export const createMissingProductRepository = () => {
  const datasource = new MissingProductDatasourceMongoImp();
  const repository = new MissingProductRepositoryImp(datasource);

  return repository;
};
