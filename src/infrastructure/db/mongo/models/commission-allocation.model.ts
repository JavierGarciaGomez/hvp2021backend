import { model, Schema } from "mongoose";
import { CommissionAllocationDocument } from "../../../../domain";
import { commissionAllocationServiceSchema } from "../../../../domain/value-objects/commissions.vo";

const CommisionAllocationSchema: Schema =
  new Schema<CommissionAllocationDocument>(
    {
      date: { type: Date, required: true },
      branch: { type: Schema.Types.ObjectId, ref: "Branch", required: true },
      ticketNumber: { type: String, required: true },
      services: {
        type: [commissionAllocationServiceSchema],
        required: true,
        default: [],
      },
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

export const CommissionAllocationModel = model<CommissionAllocationDocument>(
  "CommissionAllocation",
  CommisionAllocationSchema
);
