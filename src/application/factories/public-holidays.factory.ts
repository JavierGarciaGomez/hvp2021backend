import {
  PublicHolidaysDatasourceMongoImp,
  PublicHolidaysRepositoryImpl,
} from "../../infrastructure";

import { PublicHolidaysService } from "../services";

export const createPublicHolidaysService = () => {
  const repository = createPublicHolidaysRepository();
  const service = new PublicHolidaysService(repository);

  return service;
};

export const createPublicHolidaysRepository = () => {
  const datasource = new PublicHolidaysDatasourceMongoImp();
  const repository = new PublicHolidaysRepositoryImpl(datasource);

  return repository;
};
