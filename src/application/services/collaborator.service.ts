import {
  CollaboratorEntity,
  CollaboratorResponse,
  EmploymentEntity,
  JobEntity,
  PublicCollaborator,
} from "../../domain/entities";
import { CollaboratorRepository } from "../../domain/repositories";
import { bcryptAdapter } from "../../infrastructure/adapters";

import { CustomQueryOptions } from "../../shared/interfaces";

import { CollaboratorDTO, PaginationDto, SortingDto } from "../dtos";
import {
  createEmploymentService,
  createJobService,
  createProductService,
} from "../factories";
import { BaseService } from "./base.service";

export class CollaboratorService extends BaseService<
  CollaboratorEntity,
  CollaboratorDTO,
  CollaboratorResponse
> {
  constructor(protected repository: CollaboratorRepository) {
    super(repository, CollaboratorEntity);
  }

  public create = async (
    dto: CollaboratorDTO
  ): Promise<CollaboratorResponse> => {
    const entity = new CollaboratorEntity(dto);
    const result = await this.repository.create(entity);
    return this.transformToResponse(result);
  };

  public getAllPublic = async (
    options: CustomQueryOptions
  ): Promise<PublicCollaborator[]> => {
    const collaborators = await this.repository.getAllForWeb(options);
    const jobService = createJobService();
    const enhancedCollaborators = await Promise.all(
      collaborators.map(async (collab) => {
        if (collab.jobId) {
          const job = await jobService.getById(collab.jobId);
          return {
            ...collab,
            jobTitle: job?.title || "Unknown",
            sortingOrder: job?.sortingOrder || 0,
          };
        }
        return collab;
      })
    );
    return enhancedCollaborators;
  };

  public register = async (
    dto: Partial<CollaboratorDTO>
  ): Promise<CollaboratorEntity> => {
    return await this.repository.register(dto);
  };

  public update = async (
    id: string,
    dto: CollaboratorDTO
  ): Promise<CollaboratorResponse> => {
    const existentCollaborator = await this.repository.getById(id);
    if (existentCollaborator?.password !== dto.password) {
      if (dto.password) dto.password = bcryptAdapter.hash(dto.password);
    }

    const collaborator = new CollaboratorEntity(dto);
    const result = await this.repository.update(id, collaborator);
    return this.transformToResponse(result);
  };

  public getCollaboratorsWithJobAndEmployment = async (
    date: string
  ): Promise<
    {
      collaborator: CollaboratorEntity;
      job?: JobEntity;
      employment?: EmploymentEntity;
    }[]
  > => {
    const collaborators = await this.getCollaboratorsByDate(date);

    const jobService = createJobService();
    const employmentService = createEmploymentService();

    // todo test
    const collaboratorsWithJobAndEmployment = await Promise.all(
      collaborators.map(async (collaborator) => {
        let job;
        if (collaborator.jobId) {
          job = await jobService.getById(collaborator.jobId);
        }

        const employment =
          await employmentService.getEmploymentByCollaboratorAndDate(
            collaborator.id!,
            "2025-05-11"
          );
        return { collaborator, job, employment };
      })
    );

    return collaboratorsWithJobAndEmployment.filter(Boolean);
  };

  public getCollaboratorsByDate = async (
    dateStr: string
  ): Promise<CollaboratorEntity[]> => {
    const date = new Date(dateStr);

    const collaborators = await this.repository.getAll();
    const filteredCollaborators = collaborators.filter((collaborator) => {
      const employmentStart = collaborator.startDate
        ? new Date(collaborator.startDate)
        : null;
      const employmentEnd = collaborator.endDate
        ? new Date(collaborator.endDate)
        : null;
      return (
        employmentStart &&
        employmentStart <= date &&
        (!employmentEnd || employmentEnd >= date)
      );
    });
    return filteredCollaborators;
  };

  public getResourceName(): string {
    return "collaborator";
  }

  transformToResponse = async (
    entity: CollaboratorEntity
  ): Promise<CollaboratorResponse> => {
    const productService = createProductService();
    const collaborator: CollaboratorResponse = {
      ...entity,
      baseContributionSalary: 10,
      dailyAverageSalary: 10,
      accumulatedAnnualIncomeRaisePercent: 10,
      accumulatedAnnualCommissionRaisePercent: 10,
      aggregatedMonthlyIncome: 10,
      imssSalaryBase: 10,
      averageDailyIncome: 10,
    };
    return collaborator;
  };
}
