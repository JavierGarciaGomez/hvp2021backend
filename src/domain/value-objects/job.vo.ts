import { Schema } from "mongoose";

export interface JobPromotionStatsVO {
  complexSurgeries: number;
  surgeries: number;
  surgeryAssistances: number;
  consultations: number;
  vaccines: number;
  totalServices: number;
}

export const JobPromotionStatsSchema = new Schema({
  complexSurgeries: { type: Number, required: true, default: 0 },
  surgeries: { type: Number, required: true, default: 0 },
  surgeryAssistances: { type: Number, required: true, default: 0 },
  consultations: { type: Number, required: true, default: 0 },
  vaccines: { type: Number, required: true, default: 0 },
  totalServices: { type: Number, required: true, default: 0 },
});
