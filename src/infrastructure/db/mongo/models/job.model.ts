import mongoose, { Schema } from "mongoose";
import { JobDocument, HRPaymentType } from "../../../../domain";

const JobSchema: Schema = new Schema<JobDocument>(
  {
    active: { type: Boolean, required: true, default: true },
    annualRaisePercent: { type: Number, required: true, default: 0 },
    quarterlyCommissionRaisePercent: {
      type: Number,
      required: true,
      default: 0,
    },
    baseIncome: { type: Number, required: true, default: 0 },
    description: { type: String, required: false, default: "" },
    hourlyRate: { type: Number, required: true, default: 0 },
    minimumIncome: { type: Number, required: true, default: 0 },
    paymentType: {
      type: String,
      enum: HRPaymentType,
      default: HRPaymentType.SALARY,
    },
    title: { type: String, required: true, default: "" },
    sortingOrder: { type: Number, required: true, default: 0 },
    incomeMultiplier: { type: Number, required: false, default: 1 },
    commissionRateAdjustment: { type: Number, required: false, default: 0.4 },
    expectedCommissionsPercentage: {
      type: Number,
      required: true,
      default: 0.4,
    },
    expectedMinimumIncome: { type: Number, required: true, default: 0 },
    expressBranchCompensation: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const JobModel = mongoose.model<JobDocument>("Job", JobSchema);
