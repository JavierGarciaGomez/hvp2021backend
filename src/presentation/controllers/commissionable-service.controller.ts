import {
  CommissionableServiceDTO,
  CommissionableServiceService,
} from "../../application";
import { BaseController } from "./base.controller";
import { CommissionableServiceEntity } from "../../domain";

export class CommissionableServiceController extends BaseController<
  CommissionableServiceEntity,
  CommissionableServiceDTO
> {
  protected resource = "CommissionableServices";
  protected path = "/CommissionableServices";
  constructor(protected service: CommissionableServiceService) {
    super(service, CommissionableServiceDTO);
  }
}
