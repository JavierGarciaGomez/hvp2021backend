import {
  CollaboratorHalfWeekClosingReportDatasource,
  CollaboratorHalfWeekClosingReportEntity,
} from "../../domain";
import { CustomQueryOptions } from "../../shared/interfaces";
import { CollaboratorHalfWeekClosingReportModel } from "../db";
import { CollaboratorModel } from "../db";
import { BaseDatasourceMongoImp } from "./base.datasource.mongo-imp";
import { getAllHelper } from "../../shared/helpers";
import { ClientSession } from "mongoose";
import { BaseError } from "../../shared";

export class CollaboratorHalfWeekClosingReportDataSourceMongoImp
  extends BaseDatasourceMongoImp<CollaboratorHalfWeekClosingReportEntity>
  implements CollaboratorHalfWeekClosingReportDatasource
{
  constructor() {
    super(
      CollaboratorHalfWeekClosingReportModel,
      CollaboratorHalfWeekClosingReportEntity
    );
  }

  async create(
    entity: CollaboratorHalfWeekClosingReportEntity,
    session?: ClientSession
  ): Promise<CollaboratorHalfWeekClosingReportEntity> {
    // Validate that collaborator exists
    const collaboratorExists = await CollaboratorModel.findById(
      entity.collaboratorId
    ).session(session || null);
    if (!collaboratorExists) {
      throw BaseError.notFound(
        `Collaborator with ID ${entity.collaboratorId} not found`
      );
    }

    return super.create(entity, session);
  }

  async getByCollaboratorId(
    collaboratorId: string,
    options?: CustomQueryOptions,
    session?: ClientSession
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]> {
    const query = { collaboratorId };
    const queryOptions = {
      ...options,
      filteringDto: { ...options?.filteringDto, ...query },
    };

    const result = await getAllHelper(
      CollaboratorHalfWeekClosingReportModel,
      queryOptions,
      session
    );
    return result.map(CollaboratorHalfWeekClosingReportEntity.fromDocument);
  }

  async getByDateRange(
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions,
    session?: ClientSession
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]> {
    const query = {
      $or: [
        {
          halfWeekStartDate: { $gte: startDate, $lte: endDate },
        },
        {
          halfWeekEndDate: { $gte: startDate, $lte: endDate },
        },
        {
          halfWeekStartDate: { $lte: startDate },
          halfWeekEndDate: { $gte: endDate },
        },
      ],
    };

    const queryOptions = {
      ...options,
      filteringDto: { ...options?.filteringDto, ...query },
    };

    const result = await getAllHelper(
      CollaboratorHalfWeekClosingReportModel,
      queryOptions,
      session
    );
    return result.map(CollaboratorHalfWeekClosingReportEntity.fromDocument);
  }

  async getByCollaboratorAndDateRange(
    collaboratorId: string,
    startDate: Date,
    endDate: Date,
    options?: CustomQueryOptions,
    session?: ClientSession
  ): Promise<CollaboratorHalfWeekClosingReportEntity[]> {
    const query = {
      collaboratorId,
      $or: [
        {
          halfWeekStartDate: { $gte: startDate, $lte: endDate },
        },
        {
          halfWeekEndDate: { $gte: startDate, $lte: endDate },
        },
        {
          halfWeekStartDate: { $lte: startDate },
          halfWeekEndDate: { $gte: endDate },
        },
      ],
    };

    const queryOptions = {
      ...options,
      filteringDto: { ...options?.filteringDto, ...query },
    };

    const result = await getAllHelper(
      CollaboratorHalfWeekClosingReportModel,
      queryOptions,
      session
    );
    return result.map(CollaboratorHalfWeekClosingReportEntity.fromDocument);
  }

  async findByCollaboratorAndExactDates(
    collaboratorId: string,
    halfWeekStartDate: Date,
    halfWeekEndDate: Date,
    session?: ClientSession
  ): Promise<CollaboratorHalfWeekClosingReportEntity | null> {
    const report = await CollaboratorHalfWeekClosingReportModel.findOne({
      collaboratorId,
      halfWeekStartDate,
      halfWeekEndDate,
    }).session(session || null);

    return report
      ? CollaboratorHalfWeekClosingReportEntity.fromDocument(report)
      : null;
  }
}
