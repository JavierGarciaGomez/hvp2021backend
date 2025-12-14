import {
  WeekShiftDatasourceMongoImp,
  WeekShiftRepositoryImpl,
} from "../../infrastructure";

import { WeekShiftService } from "../services";

export const createWeekShiftService = () => {
  const repository = createWeekShiftRepository();
  const service = new WeekShiftService(repository);

  return service;
};

export const createWeekShiftRepository = () => {
  const datasource = new WeekShiftDatasourceMongoImp();
  const repository = new WeekShiftRepositoryImpl(datasource);

  return repository;
};
