import mongoose, { Schema } from "mongoose";
import {
  EmploymentDocument,
  HRAttendanceSource,
  HRPaymentType,
  employmentFixedConceptSchema,
  SATJourneyType,
  SATPaymentFrequency,
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
    seniorityBonusPercentage: { type: Number, required: true, default: 0 },
    commissionBonusPercentage: { type: Number, required: true, default: 0 },
    employmentGuaranteedIncome: { type: Number, required: true, default: 0 },
    employmentFixedIncomeByJob: { type: Number, required: true, default: 0 },
    additionalFixedIncomes: {
      type: [employmentFixedConceptSchema],
      required: false,
      default: [],
    },
    employmentHourlyRate: { type: Number, required: true, default: 0 },
    totalFixedIncome: { type: Number, required: true, default: 0 },
    nominalDailyFixedIncome: { type: Number, required: true, default: 0 },
    nominalHourlyFixedIncome: { type: Number, required: true, default: 0 },
    effectiveDailyFixedIncome: { type: Number, required: true, default: 0 },
    effectiveHourlyFixedIncome: { type: Number, required: true, default: 0 },
    averageCommissionsPerScheduledHour: {
      type: Number,
      required: true,
      default: 0,
    },
    averageOrdinaryIncomePerScheduledHour: {
      type: Number,
      required: true,
      default: 0,
    },
    trainingSupport: { type: Number, required: true, default: 0 },
    physicalActivitySupport: { type: Number, required: true, default: 0 },
    contributionBaseSalary: { type: Number, required: true, default: 0 },
    otherDeductions: {
      type: [employmentFixedConceptSchema],
      required: false,
      default: [],
    },
    // CFDI/SAT fields
    journeyType: {
      type: String,
      enum: Object.values(SATJourneyType),
      required: false,
    },
    cfdiPaymentFrequency: {
      type: String,
      enum: Object.values(SATPaymentFrequency),
      required: false,
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
