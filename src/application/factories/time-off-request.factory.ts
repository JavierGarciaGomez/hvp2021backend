import {
  TimeOffRequestDatasourceMongoImp,
  TimeOffRequestRepositoryImpl,
} from "../../infrastructure";

import { TimeOffRequestService } from "../services";

export const createTimeOffRequestService = () => {
  const repository = createTimeOffRequestRepository();
  const service = new TimeOffRequestService(repository);

  return service;
};

export const createTimeOffRequestRepository = () => {
  const datasource = new TimeOffRequestDatasourceMongoImp();
  const repository = new TimeOffRequestRepositoryImpl(datasource);

  return repository;
};
