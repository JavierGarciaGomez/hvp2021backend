// 339
import { Schema, model, Document } from "mongoose";

export enum CollaboratorRole {
  admin = "Administrador",
  manager = "Gerente",
  collaborator = "Colaborador",
  user = "User",
  guest = "Invitado",
}

export interface Collaborator extends Document {
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
  // VacationDays
  startDate?: Date;
  endDate?: Date;
  vacationsTakenBefore2021?: number;
  createdBy: Schema.Types.ObjectId;
}

const CollaboratorSchema = new Schema<Collaborator>({
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
    default: false,
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
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "Collaborator",
  },
});

const CollaboratorModel = model<Collaborator>(
  "Collaborator",
  CollaboratorSchema
);

export default CollaboratorModel;
