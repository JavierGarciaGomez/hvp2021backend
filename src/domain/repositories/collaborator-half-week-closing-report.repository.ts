import { CustomQueryOptions } from "../../shared/interfaces";
import { CollaboratorHalfWeekClosingReportEntity } from "../entities/";
import { BaseRepository } from "./base.repository";

export abstract class CollaboratorHalfWeekClosingReportRepository extends BaseRepository<CollaboratorHalfWeekClosingReportEntity> {
  abstract getByCollaboratorId(
    collaboratorId: string,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]>;

  abstract getByDateRange(
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]>;

  abstract getByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]>;

  abstract findByCollaboratorAndExactDates(
    collaboratorId: string,
    halfWeekStartDate: Date,
    halfWeekEndDate: Date
  ): Promise<CollaboratorHalfWeekClosingReportEntity | null>;
}
