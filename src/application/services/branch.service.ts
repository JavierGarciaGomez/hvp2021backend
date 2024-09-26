import { BranchEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { BranchRepository } from "../../domain";
import { BranchDTO } from "../dtos";

export class BranchService extends BaseService<BranchEntity, BranchDTO> {
  constructor(protected readonly repository: BranchRepository) {
    super(repository, BranchEntity);
  }

  public getResourceName(): string {
    return "branch";
  }
}
