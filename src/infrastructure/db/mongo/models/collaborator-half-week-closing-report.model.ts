import mongoose, { Schema, Model } from "mongoose";
import { CollaboratorHalfWeekClosingReportDocument } from "../../../../domain";

const InvalidClosingDetailSchema = new Schema(
  {
    id: { type: String, required: true },
    reason: { type: String, required: true },

    date: { type: Date, required: true },
  },
  { _id: false }
);

const InvalidWithdrawalDetailSchema = new Schema(
  {
    id: { type: String, required: true },
    reason: { type: String, required: true },
    date: { type: Date, required: true },
  },
  { _id: false }
);

const CollaboratorHalfWeekClosingReportSchema: Schema =
  new Schema<CollaboratorHalfWeekClosingReportDocument>(
    {
      collaboratorId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Collaborator",
      },
      halfWeekStartDate: {
        type: Date,
        required: true,
      },
      halfWeekEndDate: {
        type: Date,
        required: true,
      },
      smallClosings: {
        type: Number,
        required: true,
        min: 0,
      },
      largeClosings: {
        type: Number,
        required: true,
        min: 0,
      },
      totalClosings: {
        type: Number,
        required: true,
        min: 0,
      },
      invalidClosings: {
        type: Number,
        required: true,
        min: 0,
      },
      invalidWithdrawals: {
        type: Number,
        required: true,
        min: 0,
      },
      bonusEarned: {
        type: Number,
        required: true,
        min: 0,
      },
      bonusDeducted: {
        type: Number,
        required: true,
        min: 0,
      },
      totalBonus: {
        type: Number,
        required: true,
        // Note: totalBonus can be negative, so no min constraint
      },
      invalidClosingsDetails: {
        type: [InvalidClosingDetailSchema],
        default: [],
      },
      invalidWithdrawalsDetails: {
        type: [InvalidWithdrawalDetailSchema],
        default: [],
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

// Create indexes for better query performance
CollaboratorHalfWeekClosingReportSchema.index({ collaboratorId: 1 });
CollaboratorHalfWeekClosingReportSchema.index({
  halfWeekStartDate: 1,
  halfWeekEndDate: 1,
});
CollaboratorHalfWeekClosingReportSchema.index({
  collaboratorId: 1,
  halfWeekStartDate: 1,
  halfWeekEndDate: 1,
});

export const CollaboratorHalfWeekClosingReportModel: Model<CollaboratorHalfWeekClosingReportDocument> =
  mongoose.model<CollaboratorHalfWeekClosingReportDocument>(
    "CollaboratorHalfWeekClosingReport",
    CollaboratorHalfWeekClosingReportSchema
  );
