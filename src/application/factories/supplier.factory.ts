import {
  SupplierDataSourceMongoImp,
  SupplierRepositoryImp,
} from "../../infrastructure";
import { SupplierService } from "../services";

export const createSupplierService = () => {
  const repository = createSupplierRepository();
  const service = new SupplierService(repository);

  return service;
};

export const createSupplierRepository = () => {
  const datasource = new SupplierDataSourceMongoImp();
  const repository = new SupplierRepositoryImp(datasource);

  return repository;
};
