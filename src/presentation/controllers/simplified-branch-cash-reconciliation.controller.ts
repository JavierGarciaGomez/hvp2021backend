import {
  SimplifiedBranchCashReconciliationDTO,
  SimplifiedBranchCashReconciliationService,
} from "../../application";
import { BaseController } from "./base.controller";
import { SimplifiedBranchCashReconciliationEntity } from "../../domain";

export class SimplifiedBranchCashReconciliationController extends BaseController<
  SimplifiedBranchCashReconciliationEntity,
  SimplifiedBranchCashReconciliationDTO
> {
  protected resource = "simplified-branch-cash-reconciliation";
  protected path = "/simplified-branch-cash-reconciliation";
  constructor(protected service: SimplifiedBranchCashReconciliationService) {
    super(service, SimplifiedBranchCashReconciliationDTO);
  }
}
