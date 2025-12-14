import { JobDatasourceMongoImp, JobRepositoryImpl } from "../../infrastructure";

import { JobService } from "../services";

export const createJobService = () => {
  const repository = createJobRepository();
  const service = new JobService(repository);

  return service;
};

export const createJobRepository = () => {
  const datasource = new JobDatasourceMongoImp();
  const repository = new JobRepositoryImpl(datasource);

  return repository;
};
