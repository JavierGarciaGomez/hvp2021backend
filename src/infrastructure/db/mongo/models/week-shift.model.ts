import mongoose, { Schema, ValidatorProps } from "mongoose";
import { WeekShiftDocument, PaymentType } from "../../../../domain";
import { DATE_FORMAT, TIME_FORMAT } from "../../../../shared";

export const WeekShiftSchema: Schema = new Schema<WeekShiftDocument>(
  {
    startingDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v: Date) => true, // Change 'string' to 'Date'
        message: (props: ValidatorProps) => `Invalid date: ${props.value}`,
      },
    },
    endingDate: {
      type: Date,
      required: true,
      validate: {
        validator: (v: Date) => true, // Change 'string' to 'Date'
        message: (props: ValidatorProps) => `Invalid date: ${props.value}`,
      },
    },
    shifts: {
      type: [
        {
          id: { type: String, required: true },
          startingTime: {
            type: String,
            required: true,
            validate: {
              validator: (v: string) => TIME_FORMAT.test(v),
              message: (props) => "${props.value} is not a valid date format",
            },
          },
          endingTime: {
            type: String,
            required: true,
            validate: {
              validator: (v: string) => TIME_FORMAT.test(v),
              message: (props) => "${props.value} is not a valid date format",
            },
          },
          collaboratorId: {
            type: Schema.Types.ObjectId,
            ref: "Collaborator",
            required: true,
          },
          shiftDate: {
            type: String,
            required: true,
            validate: {
              validator: (v: string) => DATE_FORMAT.test(v),
              message: (props) => "${props.value} is not a valid date format",
            },
          },
          branchId: {
            type: Schema.Types.ObjectId,
            ref: "Branch",
          },
          isRemote: { type: Boolean, default: false },
        },
      ],
      default: [],
    },
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
