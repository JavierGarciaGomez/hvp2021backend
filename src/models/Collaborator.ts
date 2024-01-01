// 339
import { Schema, model, Document } from "mongoose";
const { roles } = require("../types/types");

enum CollaboratorRoles {
  admin = "Administrador",
  manager = "Gerente",
  collaborator = "Colaborador",
  user = "User",
  guest = "Invitado",
}

interface Collaborator extends Document {
  first_name: string;
  last_name: string;
  role: CollaboratorRoles; // You might want to use Roles enum here
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
  remainingVacationsAtDecember2020?: number;
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
    enum: roles,
    default: roles[2],
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
  remainingVacationsAtDecember2020: {
    type: Number,
  },
});

const CollaboratorModel = model<Collaborator>(
  "Collaborator",
  CollaboratorSchema
);

export default CollaboratorModel;
