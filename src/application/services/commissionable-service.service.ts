import { CommissionableServiceEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { CommissionableServiceRepository } from "../../domain";
import { CommissionableServiceDTO } from "../dtos";

export class CommissionableServiceService extends BaseService<
  CommissionableServiceEntity,
  CommissionableServiceDTO
> {
  constructor(protected readonly repository: CommissionableServiceRepository) {
    super(repository, CommissionableServiceEntity);
  }

  public getResourceName(): string {
    return "commissionable-service";
  }
}
