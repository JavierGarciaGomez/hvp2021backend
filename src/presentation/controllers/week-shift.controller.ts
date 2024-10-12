import { WeekShiftDTO, WeekShiftService } from "../../application";
import { BaseController } from "./base.controller";
import { WeekShiftEntity } from "../../domain";

export class WeekShiftController extends BaseController<
  WeekShiftEntity,
  WeekShiftDTO
> {
  protected resource = "week-shifts";
  protected path = "/week-shifts";
  constructor(protected service: WeekShiftService) {
    super(service, WeekShiftDTO);
  }
}
