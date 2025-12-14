import {
  BranchCashReconciliationDTO,
  BranchCashReconciliationService,
} from "../../application";
import { BaseController } from "./base.controller";
import { BranchCashReconciliationEntity } from "../../domain";

export class BranchCashReconciliationController extends BaseController<
  BranchCashReconciliationEntity,
  BranchCashReconciliationDTO
> {
  protected resource = "branch-cash-reconciliation";
  protected path = "/branch-cash-reconciliation";
  constructor(protected service: BranchCashReconciliationService) {
    super(service, BranchCashReconciliationDTO);
  }
}
