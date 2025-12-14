import {
  CollaboratorHalfWeekClosingReportEntity,
  CollaboratorHalfWeekClosingReportResponse,
} from "../../domain/entities";
import { CollaboratorHalfWeekClosingReportRepository } from "../../domain/repositories";
import {
  CustomQueryOptions,
  AuthenticatedCollaborator,
} from "../../shared/interfaces";
import { CollaboratorHalfWeekClosingReportDTO } from "../dtos";
import { BaseService } from "./base.service";
import { ClientSession } from "mongoose";

export class CollaboratorHalfWeekClosingReportService extends BaseService<
  CollaboratorHalfWeekClosingReportEntity,
  CollaboratorHalfWeekClosingReportDTO,
  CollaboratorHalfWeekClosingReportResponse
> {
  constructor(
    protected repository: CollaboratorHalfWeekClosingReportRepository
  ) {
    super(repository, CollaboratorHalfWeekClosingReportEntity);
  }

  public upsert = async (
    dto: CollaboratorHalfWeekClosingReportDTO,
    authUser?: AuthenticatedCollaborator,
    session?: ClientSession
  ): Promise<CollaboratorHalfWeekClosingReportResponse> => {
    // Check if a report already exists for this collaborator and date range
    const existingReport =
      await this.repository.findByCollaboratorAndExactDates(
        dto.collaboratorId,
        dto.halfWeekStartDate,
        dto.halfWeekEndDate
      );

    if (existingReport) {
      // Update existing report
      const updatedEntity = new CollaboratorHalfWeekClosingReportEntity({
        ...dto,
        id: existingReport.id,
        createdAt: existingReport.createdAt,
        createdBy: existingReport.createdBy,
        updatedAt: new Date(),
        updatedBy: authUser?.uid,
      });

      const result = await this.repository.update(
        existingReport.id!,
        updatedEntity,
        session
      );
      return this.transformToResponse(result);
    } else {
      // Create new report
      const newEntity = new CollaboratorHalfWeekClosingReportEntity({
        ...dto,
        createdAt: new Date(),
        createdBy: authUser?.uid,
        updatedAt: new Date(),
        updatedBy: authUser?.uid,
      });

      const result = await this.repository.create(newEntity, session);
      return this.transformToResponse(result);
    }
  };

  public upsertMany = async (
    dtos: CollaboratorHalfWeekClosingReportDTO[],
    authUser?: AuthenticatedCollaborator,
    session?: ClientSession
  ): Promise<CollaboratorHalfWeekClosingReportResponse[]> => {
    const results: CollaboratorHalfWeekClosingReportResponse[] = [];

    for (const dto of dtos) {
      const result = await this.upsert(dto, authUser, session);
      results.push(result);
    }

    return results;
  };

  public getByCollaboratorId = async (
    collaboratorId: string,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportResponse[]> => {
    const reports = await this.repository.getByCollaboratorId(
      collaboratorId,
      options
    );
    return await Promise.all(reports.map(this.transformToResponse));
  };

  public getByDateRange = async (
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportResponse[]> => {
    const reports = await this.repository.getByDateRange(
      startDate,
      endDate,
      options
    );
    return await Promise.all(reports.map(this.transformToResponse));
  };

  public getByCollaboratorAndDateRange = async (
    collaboratorId: string,
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions
  ): Promise<CollaboratorHalfWeekClosingReportResponse[]> => {
    const reports = await this.repository.getByCollaboratorAndDateRange(
      collaboratorId,
      startDate,
      endDate,
      options
    );
    return await Promise.all(reports.map(this.transformToResponse));
  };

  public getResourceName(): string {
    return "collaborator-half-week-closing-report";
  }

  transformToResponse = async (
    entity: CollaboratorHalfWeekClosingReportEntity
  ): Promise<CollaboratorHalfWeekClosingReportResponse> => {
    const response: CollaboratorHalfWeekClosingReportResponse = {
      ...entity,
    };
    return response;
  };
}
