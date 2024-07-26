import { ProductDatasourceMongoImp } from "../../infrastructure";
import { ProductRepositoryImpl } from "../../infrastructure/repositories/product.repository.imp";

import { ProductService } from "../services";

export const createProductService = () => {
  const datasource = new ProductDatasourceMongoImp();
  const repository = new ProductRepositoryImpl(datasource);
  const service = new ProductService(repository);

  return service;
};
