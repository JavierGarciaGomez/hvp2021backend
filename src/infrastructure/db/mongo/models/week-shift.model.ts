import mongoose, { Schema } from "mongoose";
import { WeekShiftDocument, PaymentType } from "../../../../domain";

export const WeekShiftSchema: Schema = new Schema<WeekShiftDocument>(
  {
    startingDate: { type: String, required: true },
    endingDate: { type: String, required: true },
    shifts: [
      {
        startingTime: { type: String },
        endingTime: { type: String },
        collaboratorId: { type: Schema.Types.ObjectId, ref: "Collaborator" },
        shiftDate: { type: String },
        branchId: { type: Schema.Types.ObjectId, ref: "Branch" },
        isRemote: { type: Boolean },
      },
    ],
    isModel: { type: Boolean, default: false },
    modelName: { type: String },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const WeekShiftModel = mongoose.model<WeekShiftDocument>(
  "WeekShift",
  WeekShiftSchema
);
