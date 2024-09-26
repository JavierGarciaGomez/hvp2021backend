import { WeekShiftEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { WeekShiftRepository } from "../../domain";
import { WeekShiftDTO } from "../dtos";

export class WeekShiftService extends BaseService<
  WeekShiftEntity,
  WeekShiftDTO
> {
  constructor(protected readonly repository: WeekShiftRepository) {
    super(repository, WeekShiftEntity);
  }

  public getResourceName(): string {
    return "week-shift";
  }
}
