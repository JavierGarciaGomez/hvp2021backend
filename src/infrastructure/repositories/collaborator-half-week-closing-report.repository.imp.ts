import { CollaboratorHalfWeekClosingReportDatasource } from "../../domain/datasources/collaborator-half-week-closing-report.datasource";
import { CollaboratorHalfWeekClosingReportEntity } from "../../domain/entities";
import { CollaboratorHalfWeekClosingReportRepository } from "../../domain/repositories";
import { CustomQueryOptions } from "../../shared/interfaces";
import { BaseRepositoryImpl } from "./base.repository.imp";

export class CollaboratorHalfWeekClosingReportRepositoryImpl
  extends BaseRepositoryImpl<CollaboratorHalfWeekClosingReportEntity>
  implements CollaboratorHalfWeekClosingReportRepository
{
  constructor(
    protected readonly datasource: CollaboratorHalfWeekClosingReportDatasource
  ) {
    super(datasource);
  }

  async getByCollaboratorId(
    collaboratorId: string,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]> {
    return await this.datasource.getByCollaboratorId(collaboratorId, options);
  }

  async getByDateRange(
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]> {
    return await this.datasource.getByDateRange(startDate, endDate, options);
  }

  async getByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]> {
    return await this.datasource.getByCollaboratorAndDateRange(
      collaboratorId,
      startDate,
      endDate,
      options
    );
  }

  async findByCollaboratorAndExactDates(
    collaboratorId: string,
    halfWeekStartDate: Date,
    halfWeekEndDate: Date
  ): Promise<CollaboratorHalfWeekClosingReportEntity | null> {
    return await this.datasource.findByCollaboratorAndExactDates(
      collaboratorId,
      halfWeekStartDate,
      halfWeekEndDate
    );
  }
}
