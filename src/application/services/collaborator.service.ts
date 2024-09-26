import {
  CollaboratorEntity,
  CollaboratorResponse,
  PublicCollaborator,
} from "../../domain/entities";
import { CollaboratorRepository } from "../../domain/repositories";
import { bcryptAdapter } from "../../infrastructure/adapters";

import { CustomQueryOptions } from "../../shared/interfaces";

import { CollaboratorDTO, PaginationDto, SortingDto } from "../dtos";
import { createProductService } from "../factories";
import { BaseService } from "./base.service";

export class CollaboratorService extends BaseService<
  CollaboratorEntity,
  CollaboratorDTO,
  CollaboratorResponse
> {
  constructor(protected repository: CollaboratorRepository) {
    super(repository, CollaboratorEntity);
  }

  public getAllPublic = async (
    options: CustomQueryOptions
  ): Promise<PublicCollaborator[]> => {
    return await this.repository.getAllForWeb(options);
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
    if (dto.password) dto.password = bcryptAdapter.hash(dto.password);
    const collaborator = new CollaboratorEntity(dto);
    const result = await this.repository.update(id, collaborator);
    return this.transformToResponse(result);
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
      baseContributionSalary:
        (await productService.getAll()) as unknown as number,
      dailyAverageSalary: 10,
      accumulatedAnnualIncomeRaisePercent: 10,
      accumulatedAnnualComissionRaisePercent: 10,
      aggregatedMonthlyIncome: 10,
      imssSalaryBase: 10,
      averageDailyIncome: 10,
    };
    return collaborator;
  };
}
