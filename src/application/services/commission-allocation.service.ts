import { CommissionAllocationEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { CommissionAllocationRepository } from "../../domain";
import { CommissionAllocationDTO } from "../dtos";

export class CommissionAllocationService extends BaseService<
  CommissionAllocationEntity,
  CommissionAllocationDTO
> {
  constructor(protected readonly repository: CommissionAllocationRepository) {
    super(repository, CommissionAllocationEntity);
  }

  public getResourceName(): string {
    return "commission-allocation";
  }
}
