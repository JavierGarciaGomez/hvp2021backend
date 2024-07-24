import mongoose, { Document, Model, Schema } from "mongoose";
import { UserRole } from "../../../../domain/enums/user.enums";

export interface IUser extends Document {
  id?: string;
  email: string;
  roles: UserRole[];
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

const UserSchema: Schema<IUser> = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    roles: {
      type: [String],
      enum: Object.values(UserRole),
      required: true,
      default: [UserRole.USER],
    },
    password: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUser> = mongoose.model("User", UserSchema);
