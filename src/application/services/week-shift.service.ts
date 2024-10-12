import { WeekShiftEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { WeekShiftRepository } from "../../domain";
import { FilteringDto, WeekShiftDTO } from "../dtos";
import { createWeekShiftService } from "../factories";

export class WeekShiftService extends BaseService<
  WeekShiftEntity,
  WeekShiftDTO
> {
  constructor(protected readonly repository: WeekShiftRepository) {
    super(repository, WeekShiftEntity);
  }

  public create = async (dto: WeekShiftDTO): Promise<WeekShiftEntity> => {
    const entity = new this.entityClass(dto);
    const result = await this.repository.create(entity);
    await this.checkForExistingWeekShifts(result.id!, result.modelName);
    return this.transformToResponse(result);
  };

  async update(id: string, dto: WeekShiftDTO): Promise<WeekShiftEntity> {
    const entity = new this.entityClass(dto);
    const result = await this.repository.update(id, entity);
    await this.checkForExistingWeekShifts(result.id!, result.modelName);

    return this.transformToResponse(result);
  }

  private async checkForExistingWeekShifts(
    excludeId: string,
    modelName?: string
  ): Promise<void> {
    if (!modelName) return;

    const weekShiftService = createWeekShiftService();
    const filteringDto = FilteringDto.create({ modelName });
    const existing = await weekShiftService.getAll({ filteringDto });

    if (existing.length > 0) {
      for (const existingShift of existing) {
        if (existingShift.id === excludeId) continue;
        const response = await this.repository.update(existingShift.id!, {
          ...existingShift,
          isModel: false,
          // @ts-ignore
          modelName: "",
        });
        console.log(response);
      }
    }
  }

  public getResourceName(): string {
    return "week-shift";
  }
}
