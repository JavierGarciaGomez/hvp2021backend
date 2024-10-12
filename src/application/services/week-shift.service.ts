import { WeekShiftEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { WeekShiftRepository } from "../../domain";
import { FilteringDto, WeekShiftDTO } from "../dtos";
import { createWeekShiftService } from "../factories";
import { BaseError } from "../../shared";

export class WeekShiftService extends BaseService<
  WeekShiftEntity,
  WeekShiftDTO
> {
  constructor(protected readonly repository: WeekShiftRepository) {
    super(repository, WeekShiftEntity);
  }

  public create = async (dto: WeekShiftDTO): Promise<WeekShiftEntity> => {
    const entity = new this.entityClass(dto);
    await this.checkForExistingWeekShifts(entity.startingDate);
    const result = await this.repository.create(entity);
    await this.checkForExistingWeekShiftsModels(result.id!, result.modelName);
    return this.transformToResponse(result);
  };

  async update(id: string, dto: WeekShiftDTO): Promise<WeekShiftEntity> {
    const entity = new this.entityClass(dto);
    const result = await this.repository.update(id, entity);
    await this.checkForExistingWeekShiftsModels(result.id!, result.modelName);

    return this.transformToResponse(result);
  }

  private async checkForExistingWeekShiftsModels(
    excludeId: string,
    modelName?: string
  ): Promise<void> {
    if (!modelName) return;
    const filteringDto = FilteringDto.create({ modelName });
    const weekShiftService = createWeekShiftService();
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

  private async checkForExistingWeekShifts(date: Date): Promise<void> {
    const weekShiftService = createWeekShiftService();

    const filteringDto = FilteringDto.create({
      startingDate: date.toISOString(),
    });
    const existing = await weekShiftService.getAll({ filteringDto });
    if (existing.length > 0) {
      throw BaseError.badRequest("Week shift already exists");
    }
    console.log(existing);
  }

  public getResourceName(): string {
    return "week-shift";
  }
}
