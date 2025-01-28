import { SalaryDataEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { SalaryDataRepository } from "../../domain";
import { SalaryDataDTO } from "../dtos";
import { BaseError } from "../../shared";

export class SalaryDataService extends BaseService<
  SalaryDataEntity,
  SalaryDataDTO
> {
  constructor(protected readonly repository: SalaryDataRepository) {
    super(repository, SalaryDataEntity);
  }

  public create = async (dto: SalaryDataDTO): Promise<SalaryDataEntity> => {
    await this.validateSalaryData(dto);
    const entity = new SalaryDataEntity(dto);
    const result = await this.repository.create(entity);
    return this.transformToResponse(result);
  };

  public update = async (
    id: string,
    dto: SalaryDataDTO
  ): Promise<SalaryDataEntity> => {
    await this.validateSalaryData(dto);
    const entity = new SalaryDataEntity(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  };

  private validateSalaryData = async (dto: SalaryDataDTO): Promise<void> => {
    const { year } = dto;
    const existingSalaryData = await this.repository.getAll({
      filteringDto: { year },
    });
    if (existingSalaryData.length > 0) {
      throw BaseError.conflict(`Salary data for year ${year} already exists`);
    }
  };

  public getResourceName(): string {
    return "salary-data";
  }
}
