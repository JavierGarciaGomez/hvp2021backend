import mongoose, { Schema } from "mongoose";
import {
  extraCompensationSchema,
  HRPaymentType,
  otherDeductionsSchema,
  PayrollDocument,
  PayrollStatus,
} from "../../../../domain";

const PayrollSchema: Schema = new Schema<PayrollDocument>(
  {
    collaboratorId: {
      type: Schema.Types.ObjectId,
      ref: "Collaborator",
      required: true,
    },
    jobId: { type: Schema.Types.ObjectId, ref: "Job", required: true },
    collaboratorFullName: { type: String, required: true },
    collaboratorCode: { type: String, required: true },
    curp: { type: String, required: true },
    socialSecurityNumber: { type: String, required: true },
    rfcNumber: { type: String, required: true },
    jobTitle: { type: String, required: true },
    paymentType: {
      type: String,
      required: true,
      enum: HRPaymentType,
      default: HRPaymentType.SALARY,
    },
    contributionBaseSalary: { type: Number, required: true },
    collaboratorStartDate: { type: Date, required: true },
    collaboratorEndDate: { type: Date, required: true },
    payrollStartDate: { type: Date, required: true },
    payrollEndDate: { type: Date, required: true },
    paymentDate: { type: Date, required: true },
    sickLeaveDays: { type: Number, required: true },
    absencesDays: { type: Number, required: true },
    payrollStatus: {
      type: String,
      required: true,
      enum: PayrollStatus,
      default: PayrollStatus.Pending,
    },
    fixedIncome: { type: Number, required: true, default: 0 },
    commissions: { type: Number, required: true, default: 0 },
    vacationsCompensation: { type: Number, required: true, default: 0 },
    minimumOrdinaryIncomeCompensation: {
      type: Number,
      required: true,
      default: 0,
    },
    justifiedAbsencesCompensation: { type: Number, required: true, default: 0 },
    expressBranchCompensation: { type: Number, required: true, default: 0 },
    yearEndBonus: { type: Number, required: true, default: 0 },
    vacationBonus: { type: Number, required: true, default: 0 },
    profitSharing: { type: Number, required: true, default: 0 },
    employmentSubsidy: { type: Number, required: true, default: 0 },
    extraHoursSinglePlay: { type: Number, required: true, default: 0 },
    extraHoursDoublePlay: { type: Number, required: true, default: 0 },
    extraHoursTriplePlay: { type: Number, required: true, default: 0 },
    sundayBonusExtraPay: { type: Number, required: true, default: 0 },
    holidayOrRestExtraPay: { type: Number, required: true, default: 0 },
    mealCompensation: { type: Number, required: true, default: 0 },
    receptionBonus: { type: Number, required: true, default: 0 },
    degreeBonus: { type: Number, required: true, default: 0 },
    punctualityBonus: { type: Number, required: true, default: 0 },
    trainingSupport: { type: Number, required: true, default: 0 },
    physicalActivitySupport: { type: Number, required: true, default: 0 },
    extraCompensations: {
      type: [extraCompensationSchema],
      required: true,
      default: [],
    },
    specialCompensation: { type: Number, required: true, default: 0 },
    incomeTaxWithholding: { type: Number, required: true, default: 0 },
    socialSecurityWithholding: { type: Number, required: true, default: 0 },
    infonavitLoanWithholding: { type: Number, required: true, default: 0 },
    otherDeductions: {
      type: [otherDeductionsSchema],
      required: true,
      default: [],
    },
    totalIncome: { type: Number, required: true, default: 0 },
    totalDeductions: { type: Number, required: true, default: 0 },
    netPay: { type: Number, required: true, default: 0 },

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

export const PayrollModel = mongoose.model<PayrollDocument>(
  "Payroll",
  PayrollSchema
);
