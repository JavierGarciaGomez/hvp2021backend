import { SalaryDataEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { SalaryDataRepository } from "../../domain";
import { SalaryDataDTO } from "../dtos";

export class SalaryDataService extends BaseService<
  SalaryDataEntity,
  SalaryDataDTO
> {
  constructor(protected readonly repository: SalaryDataRepository) {
    super(repository, SalaryDataEntity);
  }

  public getResourceName(): string {
    return "salary-data";
  }
}
