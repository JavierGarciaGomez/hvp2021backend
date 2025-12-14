import { Schema, model } from "mongoose";
import {
  BranchCashReconciliationDocument,
  moneyInDrawerSchema,
  reconciliationExpenseSchema,
} from "../../../../domain";
import { linkedTransactionSchema } from "../../../../domain/value-objects/linkedTransaction.vo";

const branchCashReconciliationSchema =
  new Schema<BranchCashReconciliationDocument>(
    {
      branchId: {
        type: Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
      },
      cashierId: {
        type: Schema.Types.ObjectId,
        ref: "Collaborator",
        required: true,
      },
      transactionDate: { type: Date, required: true },
      transactionDatetime: { type: Date, required: true },
      cashInDrawerStart: { type: Number, required: true },
      cashInDrawerEnd: { type: Number, required: true },
      moneyInDrawerEnd: { type: [moneyInDrawerSchema], required: true },
      creditSalesPayment: { type: Number, required: true },
      salesPayment: { type: Number, required: true },
      accountPayment: { type: Number, required: true },
      cashInFlow: { type: Number, required: true },
      cashOutFlow: { type: Number, required: true },
      totalSales: { type: Number, required: true },
      creditSales: { type: Number, required: true },
      reconciliationExpenses: {
        type: [reconciliationExpenseSchema],
        required: true,
      },
      transactionIds: { type: [linkedTransactionSchema], required: true },
      cashDifference: { type: Number, required: true },
      originAccountId: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true,
      },
      destinationAccountId: {
        type: Schema.Types.ObjectId,
        ref: "Account",
        required: true,
      },
    },
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    }
  );

export const BranchCashReconciliationModel =
  model<BranchCashReconciliationDocument>(
    "BranchCashReconciliation",
    branchCashReconciliationSchema
  );
