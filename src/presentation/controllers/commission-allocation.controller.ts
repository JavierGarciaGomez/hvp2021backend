import {
  CommissionAllocationDTO,
  CommissionAllocationService,
} from "../../application";
import { BaseController } from "./base.controller";
import { CommissionAllocationEntity } from "../../domain";

export class CommissionAllocationController extends BaseController<
  CommissionAllocationEntity,
  CommissionAllocationDTO
> {
  protected resource = "CommissionAllocations";
  protected path = "/CommissionAllocations";
  constructor(protected service: CommissionAllocationService) {
    super(service, CommissionAllocationDTO);
  }
}
