import { WeekShiftDTO, WeekShiftService } from "../../application";
import { BaseController } from "./base.controller";
import { WeekShiftEntity } from "../../domain";

export class WeekShiftController extends BaseController<
  WeekShiftEntity,
  WeekShiftDTO
> {
  protected resource = "weeh-shift";
  protected path = "/weeh-shifts";
  constructor(protected service: WeekShiftService) {
    super(service, WeekShiftDTO);
  }
}
