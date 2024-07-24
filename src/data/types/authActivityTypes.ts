import { Schema } from "mongoose";
import { Branch } from "./branch";

export interface AuthActivity extends Document {
  _id?: Schema.Types.ObjectId;
  user: Schema.Types.ObjectId;
  activity: AuthActivityType;
  createdAt?: string;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: string;
  updatedBy?: Schema.Types.ObjectId;
}

export enum AuthActivityType {
  LOGIN = "LOGIN",
  REFRESH_TOKEN = "REFRESH_TOKEN",
  LOGOUT = "LOGOUT",
  REGISTER = "REGISTER",
  CHANGE_PASSWORD = "CHANGE_PASSWORD",
  GOOGLE_LOGIN = "GOOGLE_LOGIN",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}
