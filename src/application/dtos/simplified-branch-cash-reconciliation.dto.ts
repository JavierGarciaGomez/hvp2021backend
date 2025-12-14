import { BaseDTO } from "./base.dto";
import {
  BranchReconciliationStatus,
  SimplifiedBranchCashReconciliationProps,
} from "../../domain";
import { checkForErrors } from "../../shared";

export class SimplifiedBranchCashReconciliationDTO implements BaseDTO {
  id?: string;
  branchId!: string;
  cashierId!: string;
  transactionDate!: Date;
  transactionDatetime!: Date;
  cashInDrawerStart!: number;
  qvetCashInDrawer!: number;
  cashInDrawerEnd!: number;
  cashTransfer!: number;
  closingCash!: number;
  status!: BranchReconciliationStatus;
  notes?: string;

  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({ ...props }: SimplifiedBranchCashReconciliationProps) {
    Object.assign(this, props);
  }

  static create(
    data: SimplifiedBranchCashReconciliationProps
  ): SimplifiedBranchCashReconciliationDTO {
    const errors: string[] = [];
    const {
      branchId,
      cashierId,
      transactionDate,
      transactionDatetime,
      cashInDrawerStart,
      qvetCashInDrawer,
      cashInDrawerEnd,
    } = data;

    if (!branchId) {
      errors.push("Branch ID is required");
    }

    if (!cashierId) {
      errors.push("Cashier ID is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    checkForErrors(errors);

    return new SimplifiedBranchCashReconciliationDTO({ ...data });
  }

  static update(
    data: SimplifiedBranchCashReconciliationProps
  ): SimplifiedBranchCashReconciliationDTO {
    return SimplifiedBranchCashReconciliationDTO.validate(data);
  }

  private static validate(
    data: SimplifiedBranchCashReconciliationProps
  ): SimplifiedBranchCashReconciliationDTO {
    return new SimplifiedBranchCashReconciliationDTO({ ...data });
  }
}
