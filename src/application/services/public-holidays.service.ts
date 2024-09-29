import { PublicHolidaysEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { PublicHolidaysRepository } from "../../domain";
import { PublicHolidaysDTO } from "../dtos";
import { BaseError } from "../../shared";

export class PublicHolidaysService extends BaseService<
  PublicHolidaysEntity,
  PublicHolidaysDTO
> {
  constructor(protected readonly repository: PublicHolidaysRepository) {
    super(repository, PublicHolidaysEntity);
  }

  public getResourceName(): string {
    return "public-holidays";
  }

  public create = async (
    dto: PublicHolidaysDTO
  ): Promise<PublicHolidaysDTO> => {
    await this.validateWrite(dto);
    const entity = new PublicHolidaysEntity(dto);
    const result = await this.repository.create(entity);
    return this.transformToResponse(result);
  };

  public update = async (
    id: string,
    dto: PublicHolidaysDTO
  ): Promise<PublicHolidaysDTO> => {
    await this.validateWrite(dto);
    const entity = new PublicHolidaysEntity(dto);
    const result = await this.repository.update(id, entity);
    return this.transformToResponse(result);
  };

  private validateWrite = async (dto: PublicHolidaysDTO): Promise<void> => {
    const { year } = dto;
    const existingData = await this.repository.getAll({
      filteringDto: { year },
    });
    if (existingData.length > 0) {
      throw BaseError.conflict(`Data for year ${year} already exists`);
    }
  };
}
