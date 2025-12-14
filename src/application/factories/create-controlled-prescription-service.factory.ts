import {
  ControlledPrescriptionDataSourceMongoImp,
  ControlledPrescriptionRepositoryImpl,
} from "../../infrastructure";
import { ControlledPrescriptionService } from "../services";

export const createControlledPrescriptionService = () => {
  const datasource = new ControlledPrescriptionDataSourceMongoImp();
  const repository = new ControlledPrescriptionRepositoryImpl(datasource);
  const service = new ControlledPrescriptionService(repository);

  return service;
};
