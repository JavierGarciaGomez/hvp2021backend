import { BranchCashReconciliationEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { BranchCashReconciliationRepository } from "../../domain";
import { BranchCashReconciliationDTO } from "../dtos";
import { createBranchService } from "../factories";

export class BranchCashReconciliationService extends BaseService<
  BranchCashReconciliationEntity,
  BranchCashReconciliationDTO
> {
  private branchService = createBranchService();
  constructor(
    protected readonly repository: BranchCashReconciliationRepository
  ) {
    super(repository, BranchCashReconciliationEntity);
  }

  public create = async (
    dto: BranchCashReconciliationDTO
  ): Promise<BranchCashReconciliationResponse> => {
    await this.validateBranchCashReconciliation(dto);
    const entity = new BranchCashReconciliationEntity(dto);
    const result = await this.repository.create(entity);
    return this.transformToResponse(result);
  };

  public update = async (
    id: string,
    dto: BranchCashReconciliationDTO
  ): Promise<BranchCashReconciliationEntity> => {
    await this.validateBranchCashReconciliation(dto);
    const entity = new BranchCashReconciliationEntity(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  };

  private validateBranchCashReconciliation = async (
    dto: BranchCashReconciliationDTO
  ): Promise<void> => {};

  public getResourceName(): string {
    return "branchCashReconciliation";
  }

  public transformToResponse = async (
    entity: BranchCashReconciliationEntity
  ): Promise<BranchCashReconciliationResponse> => {
    const branch = await this.branchService.getById(entity.branchId);
    return {
      ...entity,
      branchName: branch.name,
      branchId: {
        id: branch.id,
        name: branch.name,
      },
    } as BranchCashReconciliationResponse;
  };
}

// todo: move to domain
type BranchCashReconciliationResponse = BranchCashReconciliationEntity & {
  branchName: string;
  branchId: {
    id: string;
    name: string;
  };
};
