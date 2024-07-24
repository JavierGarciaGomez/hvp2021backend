import { Schema, model } from "mongoose";
import { AuthActivity, AuthActivityType } from "../../../../shared";

const authActivitySchema = new Schema<AuthActivity>(
  {
    user: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    activity: {
      type: String,
      enum: Object.values(AuthActivityType),
      required: true,
    },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  { timestamps: true }
);

const AuthActivityModel = model<AuthActivity>(
  "AuthActivity",
  authActivitySchema
);

export default AuthActivityModel;
