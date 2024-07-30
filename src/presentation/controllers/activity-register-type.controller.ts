import { ActivityRegisterTypeService } from "../../application";
import { BaseController } from "./base.controller";
import { ActivityRegisterTypeVO, SupplierEntity } from "../../domain";
import { BaseOptionVODTO } from "../../application/dtos/base-option.dto";

export class ActivityRegisterTypeController extends BaseController<
  ActivityRegisterTypeVO,
  BaseOptionVODTO
> {
  protected resource = "activity-register-type";
  protected path = "/activity-register-types";
  constructor(protected service: ActivityRegisterTypeService) {
    super(service, BaseOptionVODTO);
  }
}
