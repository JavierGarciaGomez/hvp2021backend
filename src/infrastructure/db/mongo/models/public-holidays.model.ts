import mongoose, { Schema } from "mongoose";
import { PublicHolidaysDocument } from "../../../../domain";

const PublicHolidaysSchema: Schema = new Schema<PublicHolidaysDocument>(
  {
    year: { type: Number, required: true },
    publicHolidays: [{ type: Date, required: true }],
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const PublicHolidaysModel = mongoose.model<PublicHolidaysDocument>(
  "PublicHolidays",
  PublicHolidaysSchema
);
