import mongoose, { Schema } from "mongoose";
import {
  HRPaymentType,
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
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    payrollStatus: {
      type: String,
      enum: PayrollStatus,
      default: PayrollStatus.Pending,
    },
    periodStartDate: { type: Date, required: true },
    periodEndDate: { type: Date, required: true },
    generalData: {
      fullName: { type: String, required: true },
      collaboratorCode: { type: String, required: true },
      curp: { type: String, required: false },
      socialSecurityNumber: { type: String, required: false },
      rfcNumber: { type: String, required: false },
      jobTitle: { type: String, required: true },
      paymentType: {
        type: String,
        required: true,
        enum: HRPaymentType,
        default: HRPaymentType.SALARY,
      },
      contributionBaseSalary: { type: Number, required: true },
    },
    earnings: {
      halfWeekFixedIncome: { type: Number, default: 0 },
      commissions: { type: Number, default: 0 },
      vacationCompensation: { type: Number, default: 0 },
      expressBranchCompensation: { type: Number, default: 0 },
      mealCompensation: { type: Number, default: 0 },
      receptionBonus: { type: Number, default: 0 },
      punctualityBonus: { type: Number, default: 0 },
      absencesJustifiedByCompanyCompensation: { type: Number, default: 0 },
      specialBonuses: [
        {
          name: String,
          description: String,
          amount: Number,
        },
      ],
      guaranteedIncomeCompensation: { type: Number, default: 0 },
      simpleOvertimeHours: { type: Number, default: 0 },
      doubleOvertimeHours: { type: Number, default: 0 },
      tripleOvertimeHours: { type: Number, default: 0 },
      sundayBonus: { type: Number, default: 0 },
      holidayOrRestExtraPay: { type: Number, default: 0 },
      traniningActivitySupport: { type: Number, default: 0 },
      physicalActivitySupport: { type: Number, default: 0 },
      extraFixedCompensations: [
        {
          name: String,
          description: String,
          amount: Number,
        },
      ],
      extraVariableCompensations: [
        {
          name: String,
          description: String,
          amount: Number,
        },
      ],
      vacationBonus: { type: Number, default: 0 },
      endYearBonus: { type: Number, default: 0 },
      profitSharing: { type: Number, default: 0 },
      employmentSubsidy: { type: Number, default: 0 },
    },
    deductions: {
      incomeTaxWithholding: { type: Number, default: 0 },
      socialSecurityWithholding: { type: Number, default: 0 },
      otherFixedDeductions: [
        {
          name: String,
          description: String,
          amount: Number,
        },
      ],
      otherVariableDeductions: [
        {
          name: String,
          description: String,
          amount: Number,
        },
      ],
      nonCountedDaysDiscount: { type: Number, default: 0 },
      justifiedAbsencesDiscount: { type: Number, default: 0 },
      unjustifiedAbsencesDiscount: { type: Number, default: 0 },
      unworkedHoursDiscount: { type: Number, default: 0 },
      tardinessDiscount: { type: Number, default: 0 },
    },
    totals: {
      totalIncome: { type: Number, default: 0 },
      totalDeductions: { type: Number, default: 0 },
      netPay: { type: Number, default: 0 },
    },
    contextData: {
      periodDaysLength: { type: Number, default: 0 },
      halfWeekFixedIncome: { type: Number, default: 0 },
      averageOrdinaryIncomeDaily: { type: Number, default: 0 },
      attendanceRelatedDiscounts: { type: Number, default: 0 },
      attendanceFactor: { type: Number, default: 0 },
      employerImssRate: { type: Number, default: 0 },
      workedHours: { type: Number, default: 0 },
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

export const PayrollModel = mongoose.model<PayrollDocument>(
  "Payroll",
  PayrollSchema
);
