import mongoose, { Schema } from "mongoose";
import { SalaryDataDocument } from "../../../../domain";

const SalaryDataSchema: Schema = new Schema<SalaryDataDocument>(
  {
    year: { type: Number, required: true },
    minimumWage: { type: Number, required: true },
    uma: { type: Number, required: true },
    ocupationalRisk: { type: Number, required: true },
    imssEmployerRates: { type: Object, required: true },
    imssEmployeeRates: { type: Object, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    annualIncreasePercentage: { type: Number, required: true },
    employmentSubsidyLimit: { type: Number, required: true },
    employmentSubsidyAmount: { type: Number, required: true },
    maxWorkingHours: { type: Number, default: 48 },
    receptionBonus: { type: Number, default: 0 },
    degreeBonus: { type: Number, default: 0 },
    trainingSupport: { type: Number, default: 0 },
    physicalActivitySupport: { type: Number, default: 0 },
    avgMonthlyOvertimeHours: { type: Number, default: 0 },
    avgMonthlySundayHours: { type: Number, default: 0 },
    avgMonthlyHolidayHours: { type: Number, default: 0 },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const SalaryDataModel = mongoose.model<SalaryDataDocument>(
  "SalaryData",
  SalaryDataSchema
);
