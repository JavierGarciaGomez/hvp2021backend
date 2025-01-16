import { Schema, model } from "mongoose";
import {
  BranchReconciliationStatus,
  SimplifiedBranchCashReconciliationDocument,
} from "../../../../domain";

const simplifiedBranchCashReconciliationSchema =
  new Schema<SimplifiedBranchCashReconciliationDocument>(
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
      qvetCashInDrawer: { type: Number, required: true },
      cashInDrawerEnd: { type: Number, required: true },
      cashTransfer: { type: Number, required: true },
      closingCash: { type: Number, required: true },
      status: {
        type: String,
        enum: BranchReconciliationStatus,
        required: true,
      },
      notes: { type: String, required: false },
    },
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    }
  );

export const SimplifiedBranchCashReconciliationModel =
  model<SimplifiedBranchCashReconciliationDocument>(
    "SimplifiedBranchCashReconciliation",
    simplifiedBranchCashReconciliationSchema
  );
