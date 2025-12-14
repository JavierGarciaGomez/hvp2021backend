import mongoose, { Schema, Document, Model } from "mongoose";
import {
  Degree,
  Gender,
  HRPaymentType,
  WebAppRole,
} from "../../../../domain/enums";
import {
  AddressSchema,
  CollaboratorDocument,
  CollaboratorProps,
} from "../../../../domain";

const CollaboratorSchema: Schema = new Schema<CollaboratorDocument>(
  {
    first_name: {
      type: String,
      required: true,
    },
    last_name: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      enum: Gender,
      required: false,
    },
    email: {
      type: String,
      required: false,
    },
    phoneNumber: {
      type: String,
      required: false,
    },
    phoneNumber2: {
      type: String,
      required: false,
    },
    address: AddressSchema,
    curp: {
      type: String,
      required: false,
    },
    imssNumber: {
      type: String,
      required: false,
    },
    rfcCode: {
      type: String,
      required: false,
    },
    emergencyContact: {
      type: String,
      required: false,
    },
    emergencyContactPhone: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      enum: WebAppRole,
      default: WebAppRole.collaborator,
    },

    imgUrl: {
      type: String,
    },
    images: [
      {
        publicId: {
          type: String,
        },
        url: {
          type: String,
        },
        thumbnailUrl: {
          type: String,
        },
        isMain: {
          type: Boolean,
        },
      },
    ],
    accessCode: {
      type: String,
    },
    isRegistered: {
      type: Boolean,
    },
    password: {
      type: String,
    },
    isDisplayedWeb: {
      type: Boolean,
      default: true,
    },
    textPresentation: {
      type: String,
      defaut: "",
    },
    registeredDate: {
      type: Date,
      default: Date.now,
      required: true,
    },
    lastLogin: {
      type: Date,
    },
    vacationsTakenBefore2021: {
      type: Number,
    },
    col_code: {
      type: String,
      required: true,
    },
    col_numId: {
      type: Number,
      required: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    position: {
      type: String,
    },
    coverShift: {
      type: Boolean,
    },
    weeklyHours: {
      type: Number,
    },
    jobId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "Job",
    },
    contractDate: {
      type: Date,
    },
    hasIMSS: {
      type: Boolean,
    },
    imssEnrollmentDate: {
      type: Date,
    },
    paymentType: {
      type: String,
      enum: HRPaymentType,
    },
    additionalCompensation: {
      type: Number,
    },
    degree: {
      type: String,
      enum: Degree,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  {
    timestamps: true,
  }
);

export const CollaboratorModel: Model<CollaboratorDocument> =
  mongoose.model<CollaboratorDocument>("Collaborator", CollaboratorSchema);
