import { Schema } from "mongoose";

export interface isrRate {
  lowerLimit: number;
  upperLimit: number;
  fixedFee: number;
  rate: number;
}

export const isrRatesSchema = new Schema({
  lowerLimit: { type: Number, required: true },
  upperLimit: { type: Number, required: true },
  fixedFee: { type: Number, required: true },
  rate: { type: Number, required: true },
});
