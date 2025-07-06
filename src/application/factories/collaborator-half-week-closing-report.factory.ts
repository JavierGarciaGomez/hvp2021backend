import {
  CollaboratorHalfWeekClosingReportDataSourceMongoImp,
  CollaboratorHalfWeekClosingReportRepositoryImpl,
} from "../../infrastructure";
import { CollaboratorHalfWeekClosingReportService } from "../services";

export const createCollaboratorHalfWeekClosingReportService = () => {
  const repository = createCollaboratorHalfWeekClosingReportRepository();
  const service = new CollaboratorHalfWeekClosingReportService(repository);

  return service;
};

export const createCollaboratorHalfWeekClosingReportRepository = () => {
  const datasource = new CollaboratorHalfWeekClosingReportDataSourceMongoImp();
  const repository = new CollaboratorHalfWeekClosingReportRepositoryImpl(
    datasource
  );

  return repository;
};
