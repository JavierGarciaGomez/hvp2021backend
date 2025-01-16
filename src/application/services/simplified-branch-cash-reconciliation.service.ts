import { SimplifiedBranchCashReconciliationEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import {
  BranchReconciliationStatus,
  SimplifiedBranchCashReconciliationRepository,
} from "../../domain";
import { SimplifiedBranchCashReconciliationDTO } from "../dtos";
import { createBranchService } from "../factories";
import { BaseError } from "../../shared";

export class SimplifiedBranchCashReconciliationService extends BaseService<
  SimplifiedBranchCashReconciliationEntity,
  SimplifiedBranchCashReconciliationDTO
> {
  private branchService = createBranchService();
  constructor(
    protected readonly repository: SimplifiedBranchCashReconciliationRepository
  ) {
    super(repository, SimplifiedBranchCashReconciliationEntity);
  }

  public create = async (
    dto: SimplifiedBranchCashReconciliationDTO
  ): Promise<SimplifiedBranchCashReconciliationResponse> => {
    try {
      await this.validateNotPending(dto)
      await this.validateSimplifiedBranchCashReconciliation(dto);
      
      const entity = new SimplifiedBranchCashReconciliationEntity(dto);
      const result = await this.repository.create(entity);
      return this.transformToResponse(result);
    } catch (error: any) {
      if (error._message) {
        throw BaseError.badRequest(error.message);
      }
      throw error;
    }
  };

  public update = async (
    id: string,
    dto: SimplifiedBranchCashReconciliationDTO
  ): Promise<SimplifiedBranchCashReconciliationEntity> => {
    await this.validateSimplifiedBranchCashReconciliation(dto);
    const entity = new SimplifiedBranchCashReconciliationEntity(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  };

  private validateSimplifiedBranchCashReconciliation = async (
    dto: SimplifiedBranchCashReconciliationDTO
  ): Promise<void> => {};

  private validateNotPending = async (
    dto: SimplifiedBranchCashReconciliationDTO
  ): Promise<void> => {
    const pendingEntity = await this.repository.exists({
      branchId: dto.branchId,
      status: BranchReconciliationStatus.PENDING,
    });
    if (pendingEntity) {
      throw BaseError.badRequest("There is already a pending reconciliation");
    }
  };

  public getResourceName(): string {
    return "simplified-branch-cash-reconciliation";
  }

  public transformToResponse = async (
    entity: SimplifiedBranchCashReconciliationEntity
  ): Promise<SimplifiedBranchCashReconciliationResponse> => {
    const branch = await this.branchService.getById(entity.branchId);
    return {
      ...entity,
      branchId: {
        id: branch.id,
        name: branch.name,
      },
    } as SimplifiedBranchCashReconciliationResponse;
  };
}

// todo: move to domain
type SimplifiedBranchCashReconciliationResponse =
  SimplifiedBranchCashReconciliationEntity & {
    branchId: {
      id: string;
      name: string;
    };
  };
