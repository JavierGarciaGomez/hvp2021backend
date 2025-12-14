import { BaseEntity } from "./../../domain/entities/base.entity";
import { AccountEntity, SaleEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { SaleRepository } from "../../domain";
import { AccountDTO, SaleDTO } from "../dtos";
import { createAccountService, createBranchService } from "../factories";
import { BaseError } from "../../shared";

export class SaleService extends BaseService<
  SaleEntity,
  SaleDTO,
  SaleResponse
> {
  private accountService = createAccountService();
  private branchService = createBranchService();
  constructor(protected readonly repository: SaleRepository) {
    super(repository, SaleEntity);
  }

  public create = async (dto: SaleDTO): Promise<SaleResponse> => {
    try {
      await this.validate(dto);
      const entity = new SaleEntity(dto);
      const result = await this.repository.create(entity);
      return this.transformToResponse(result);
    } catch (error) {
      throw error;
    }
  };

  public update = async (id: string, dto: SaleDTO): Promise<SaleResponse> => {
    await this.validate(dto);
    const entity = new SaleEntity(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  };

  private validate = async (dto: SaleDTO): Promise<void> => {
    const { subTotal, totalTax, totalAmount } = dto;
    if (subTotal + totalTax !== totalAmount) {
      throw BaseError.badRequest("Total amount is not valid");
    }
    await this.validateReferences(dto);
    const { customerId, costCenterId, accountId } = dto;
    const account = await this.accountService.getById(accountId);
    if (!customerId) {
      throw new Error("Customer is required");
    }
    if (!accountId) {
      throw BaseError.badRequest("Account is required");
    }
  };

  private validateReferences = async (dto: SaleDTO): Promise<void> => {
    const { customerId, costCenterId, accountId } = dto;

    try {
      await this.accountService.getById(accountId);
    } catch (error) {
      throw BaseError.badRequest("Account not found");
    }

    try {
      await this.branchService.getById(costCenterId);
    } catch (error) {
      throw BaseError.badRequest("Cost center not found");
    }

    if (!customerId) {
      throw BaseError.badRequest("Customer is required");
    }
  };

  public getResourceName(): string {
    return "salary-data";
  }

  public transformToResponse = async (
    entity: SaleEntity
  ): Promise<SaleResponse> => {
    return {
      ...entity,
      culio: "culio",
    } as SaleResponse;
  };
}

type SaleResponse = SaleEntity & {
  culio: string;
};
