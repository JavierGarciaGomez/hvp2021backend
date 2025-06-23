import mongoose, { Schema } from "mongoose";
import {
  EmploymentDocument,
  extraCompensationSchema,
  HRAttendanceSource,
  HRPaymentType,
  otherDeductionSchema,
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
    paymentType: {
      type: String,
      enum: HRPaymentType,
      required: true,
      default: HRPaymentType.SALARY,
    },
    attendanceSource: {
      type: String,
      enum: HRAttendanceSource,
      required: true,
    },
    weeklyHours: { type: Number, required: true, default: 0 },
    dailyWorkingHours: { type: Number, required: true, default: 0 },
    workWeekRatio: { type: Number, required: true, default: 0 },
    employmentGuaranteedIncome: { type: Number, required: true, default: 0 },
    seniorityBonusPercentage: { type: Number, required: true, default: 0 },
    commissionBonusPercentage: { type: Number, required: true, default: 0 },
    fixedIncomeByPosition: { type: Number, required: true, default: 0 },
    additionalFixedIncome: { type: Number, required: true, default: 0 },
    fixedIncome: { type: Number, required: true, default: 0 },
    minimumOrdinaryIncome: { type: Number, required: true, default: 0 },
    degreeBonus: { type: Number, required: true, default: 0 },
    trainingSupport: { type: Number, required: true, default: 0 },
    physicalActivitySupport: { type: Number, required: true, default: 0 },
    contributionBaseSalary: { type: Number, required: true, default: 0 },
    extraCompensations: {
      type: [extraCompensationSchema],
      required: false,
      default: [],
    },
    otherDeductions: {
      type: [otherDeductionSchema],
      required: false,
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

export const EmploymentModel = mongoose.model<EmploymentDocument>(
  "Employment",
  EmploymentSchema
);
