import { Schema } from "mongoose";

export interface EmploymentFixedConcept {
  name: string;
  description?: string;
  amount: number;
  isAttendanceRelated: boolean;
}

export const employmentFixedConceptSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: false },
  amount: { type: Number, required: true },
  isAttendanceRelated: { type: Boolean, required: true },
});
