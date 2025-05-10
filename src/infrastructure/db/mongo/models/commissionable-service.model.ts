import { model, Schema } from "mongoose";
import {
  CommissionableServiceDocument,
  CommissionCalculationType,
} from "../../../../domain";

const CommisionableServiceSchema: Schema =
  new Schema<CommissionableServiceDocument>(
    {
      name: { type: String, required: true },
      commissionCalculationType: {
        type: String,
        required: true,
        enum: CommissionCalculationType,
      },
      basePrice: { type: Number, required: true, default: 0 },
      baseRate: { type: Number, required: true, default: 0 },
      maxRate: { type: Number, required: true, default: 0 },
      allowSalesCommission: { type: Boolean, required: true, default: false },
      baseCommission: { type: Number, required: true, default: 0 },
      maxCommission: { type: Number, required: true, default: 0 },
      isActive: { type: Boolean, required: true, default: true },
      createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
      updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    },
    {
      timestamps: {
        createdAt: "createdAt",
        updatedAt: "updatedAt",
      },
    }
  );

export const CommissionableServiceModel = model<CommissionableServiceDocument>(
  "CommissionableService",
  CommisionableServiceSchema
);
