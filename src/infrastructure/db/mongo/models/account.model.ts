import { Schema, model } from "mongoose";
import { AccountProps } from "../../../../domain/entities/account.entity";
import { bankAccountSchema } from "../../../../domain/value-objects/bank-account.vo";

const accountSchema = new Schema<AccountProps>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    accountClass: { type: String, required: true },
    accountType: { type: String, required: true },
    subType: { type: String, required: true },
    code: { type: String, required: true },
    isActive: { type: Boolean, default: true },
    fullyQualifiedName: { type: String, required: true },
    currency: { type: String, required: true },
    parentAccountId: { type: String, required: true },
    bankAccount: { type: bankAccountSchema, required: false },
    isSubAccount: { type: Boolean, required: true },
    openingBalance: { type: Number, required: true },
    currentBalance: { type: Number, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const AccountModel = model<AccountProps>("Account", accountSchema);
