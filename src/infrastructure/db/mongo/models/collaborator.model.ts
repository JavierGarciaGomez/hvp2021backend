import mongoose, { Schema, Document, Model } from "mongoose";
import { CollaboratorRole } from "../../../../domain/enums";

export interface CollaboratorDocument extends Document {
  id?: string;
  first_name: string;
  last_name: string;
  role: CollaboratorRole;
  col_code: string;
  col_numId?: number;
  isActive: boolean;
  gender?: string;
  imgUrl?: string;
  accessCode?: string;
  isRegistered: boolean;
  email?: string;
  password?: string;
  position?: string;
  isDisplayedWeb: boolean;
  textPresentation?: string;
  registeredDate: Date;
  lastLogin?: Date;
  startDate?: Date;
  endDate?: Date;
  vacationsTakenBefore2021?: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

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
    role: {
      type: String,
      enum: CollaboratorRole,
      default: CollaboratorRole.collaborator,
    },
    col_code: {
      type: String,
      required: true,
    },
    col_numId: {
      type: Number,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    gender: {
      type: String,
    },
    imgUrl: {
      type: String,
    },
    accessCode: {
      type: String,
    },
    isRegistered: {
      type: Boolean,
    },
    email: {
      type: String,
    },
    password: {
      type: String,
    },
    position: {
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
    // VacationDays
    startDate: {
      type: Date,
    },
    endDate: {
      type: Date,
    },
    vacationsTakenBefore2021: {
      type: Number,
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
