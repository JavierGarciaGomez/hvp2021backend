import { ProductDatasourceMongoImp } from "../../infrastructure";
import { ProductRepositoryImpl } from "../../infrastructure/repositories/product.repository.imp";

import { ProductService } from "../services";

export const createProductService = () => {
  const repository = createProductRepository();
  const service = new ProductService(repository);

  return service;
};

export const createProductRepository = () => {
  const datasource = new ProductDatasourceMongoImp();
  const repository = new ProductRepositoryImpl(datasource);

  return repository;
};
