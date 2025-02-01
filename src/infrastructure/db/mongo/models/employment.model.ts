import mongoose, { Schema } from "mongoose";
import {
  EmploymentDocument,
  extraCompensationSchema,
  HRPaymentType,
} from "../../../../domain";

const EmploymentSchema: Schema = new Schema<EmploymentDocument>(
  {
    collaboratorId: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
      required: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    employmentStartDate: { type: Date, required: true },
    employmentEndDate: { type: Date, required: false },
    isActive: { type: Boolean, required: true, default: true },
    weeklyHours: { type: Number, required: true, default: 0 },
    paymentType: {
      type: String,
      enum: HRPaymentType,
      required: true,
      default: HRPaymentType.SALARY,
    },
    seniorityBonusPercentage: { type: Number, required: true, default: 0 },
    comissionBonusPercentage: { type: Number, required: true, default: 0 },
    fixedIncome: { type: Number, required: true, default: 0 },
    minimumOrdinaryIncome: { type: Number, required: true, default: 0 },
    degreeBonus: { type: Number, required: true, default: 0 },
    receptionBonus: { type: Number, required: true, default: 0 },
    trainingSupport: { type: Number, required: true, default: 0 },
    physicalActivitySupport: { type: Number, required: true, default: 0 },
    contributionBaseSalary: { type: Number, required: true, default: 0 },
    averageOrdinaryIncome: { type: Number, required: true, default: 0 },
    averageIntegratedIncome: { type: Number, required: true, default: 0 },
    averageComissionIncome: { type: Number, required: true, default: 0 },
    extraCompensations: {
      type: [extraCompensationSchema],
      required: false,
      default: [],
    },
    fixedIncomeByPosition: { type: Number, required: true, default: 0 },
    additionalFixedIncome: { type: Number, required: true, default: 0 },
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

export const EmploymentModel = mongoose.model<EmploymentDocument>(
  "Employment",
  EmploymentSchema
);
