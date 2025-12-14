import mongoose, { Schema } from "mongoose";
import { JobDocument, JobPromotionStatsSchema } from "../../../../domain";

const JobSchema: Schema = new Schema<JobDocument>(
  {
    active: { type: Boolean, required: true, default: true },
    description: { type: String, required: false, default: "" },
    title: { type: String, required: true, default: "" },
    sortingOrder: { type: Number, required: true, default: 0 },
    commissionRateAdjustment: { type: Number, required: false, default: 0.4 },
    expressBranchCompensation: { type: Number, required: true, default: 0 },
    promotionJobId: {
      type: Schema.Types.ObjectId,
      ref: "Job",
      required: false,
      default: null,
    },
    quarterPromotionRequirements: {
      type: JobPromotionStatsSchema,
      required: false,
      default: null,
    },
    historicalPromotionRequirements: {
      type: JobPromotionStatsSchema,
      required: false,
      default: null,
    },
    positionFactor: { type: Number, required: false, default: 1 },
    guaranteedJobIncome: { type: Number, required: false },
    jobFixedIncome: { type: Number, required: false },
    fixedShareOfGuaranteedIncome: {
      type: Number,
      required: false,
      default: 0.4,
    },
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
