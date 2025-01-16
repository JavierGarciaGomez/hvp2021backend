import {
  SaleDatasourceMongoImp,
  SaleRepositoryImpl,
} from "../../infrastructure";

import { SaleService } from "../services";

export const createSaleService = () => {
  const repository = createSaleRepository();
  const service = new SaleService(repository);

  return service;
};

export const createSaleRepository = () => {
  const datasource = new SaleDatasourceMongoImp();
  const repository = new SaleRepositoryImpl(datasource);

  return repository;
};
