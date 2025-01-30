import { EmploymentEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { EmploymentRepository } from "../../domain";
import { EmploymentDTO } from "../dtos";
import {
  AuthenticatedCollaborator,
  BaseError,
  buildQueryOptions,
} from "../../shared";
import mongoose from "mongoose";
import { EmploymentModel } from "../../infrastructure";

export class EmploymentService extends BaseService<
  EmploymentEntity,
  EmploymentDTO
> {
  constructor(protected readonly repository: EmploymentRepository) {
    super(repository, EmploymentEntity);
  }

  public create = async (
    data: EmploymentDTO,
    authUser?: AuthenticatedCollaborator
  ): Promise<EmploymentEntity> => {
    const entity = new this.entityClass(data); // Use Mongoose model for creating
    const result = await this.repository.create(entity);

    // Get the last entity (if any) that needs to be updated
    const query = buildQueryOptions({
      collaboratorId: data.collaboratorId,
      sort_by: "employmentStartDate",
      direction: "desc",
      employmentStartDate: { $lte: entity.employmentStartDate },
      _id: { $ne: result.id },
    });
    const response = await this.repository.getAll(query);
    const lastEntity = response[0];

    if (lastEntity) {
      this.update(lastEntity.id!, {
        ...lastEntity,
        isActive: false,
        employmentEndDate: new Date(entity.employmentStartDate),
      });
    }
    return this.transformToResponse(result);
  };

  public getResourceName(): string {
    return "employment";
  }
}
