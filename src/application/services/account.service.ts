import { AccountEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { AccountRepository } from "../../domain";
import { AccountDTO } from "../dtos";

export class AccountService extends BaseService<AccountEntity, AccountDTO> {
  constructor(protected readonly repository: AccountRepository) {
    super(repository, AccountEntity);
  }

  public create = async (dto: AccountDTO): Promise<AccountEntity> => {
    await this.validateAccount(dto);
    const entity = new AccountEntity(dto);
    const result = await this.repository.create(entity);
    return this.transformToResponse(result);
  };

  public update = async (
    id: string,
    dto: AccountDTO
  ): Promise<AccountEntity> => {
    await this.validateAccount(dto);
    const entity = new AccountEntity(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  };

  private validateAccount = async (dto: AccountDTO): Promise<void> => {};

  public getResourceName(): string {
    return "account";
  }
}
