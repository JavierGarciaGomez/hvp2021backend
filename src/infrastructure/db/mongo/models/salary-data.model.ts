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
  },
  {
    timestamps: true,
  }
);

export const SalaryDataModel = mongoose.model<SalaryDataDocument>(
  "SalaryData",
  SalaryDataSchema
);
