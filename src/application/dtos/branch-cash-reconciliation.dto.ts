import { BaseDTO } from "./base.dto";
import { LinkedTransactionVO } from "../../domain/value-objects/linkedTransaction.vo";
import {
  BranchCashReconciliationProps,
  MoneyInDrawerVO,
  ReconciliationExpenseVO,
} from "../../domain";
import { checkForErrors } from "../../shared";

export class BranchCashReconciliationDTO implements BaseDTO {
  id?: string;
  branchId!: string;
  cashierId!: string;
  transactionDate!: Date;
  transactionDatetime!: Date;
  cashInDrawerStart!: number;
  cashInDrawerEnd!: number;
  moneyInDrawerEnd!: MoneyInDrawerVO[];
  creditSalesPayment!: number;
  salesPayment!: number;
  accountPayment!: number;
  cashInFlow!: number;
  cashOutFlow!: number;
  totalSales!: number;
  creditSales!: number;
  reconciliationExpenses!: ReconciliationExpenseVO[];
  transactionIds!: LinkedTransactionVO[];
  cashDifference!: number;
  originAccountId!: string;
  destinationAccountId!: string;
  notes?: string;
  status!: "pending" | "completed" | "cancelled";

  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({ ...props }: BranchCashReconciliationProps) {
    Object.assign(this, props);
  }

  static create(
    data: BranchCashReconciliationProps
  ): BranchCashReconciliationDTO {
    const errors: string[] = [];
    const {
      branchId,
      cashierId,
      transactionDate,
      transactionDatetime,
      cashInDrawerStart,
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

    return new BranchCashReconciliationDTO({ ...data });
  }

  static update(
    data: BranchCashReconciliationProps
  ): BranchCashReconciliationDTO {
    return BranchCashReconciliationDTO.validate(data);
  }

  private static validate(
    data: BranchCashReconciliationProps
  ): BranchCashReconciliationDTO {
    return new BranchCashReconciliationDTO({ ...data });
  }
}
