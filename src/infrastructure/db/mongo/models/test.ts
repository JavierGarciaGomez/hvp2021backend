export class Account {
  constructor(
    public id: string,
    public name: string,
    public accountClass: string,
    public accountType: string,
    public subType: string,
    public code: string,
    public isActive: boolean,
    public fullyQualifiedName: string,
    public currency: string,
    public parentAccountId: string | null,
    public isSubAccount: boolean,
    public openingBalance: number,
    public currentBalance: number,
    public description?: string,
    public bankAccount?: string
  ) {
    if (!this.isValid()) {
      throw new Error("Invalid account data");
    }
  }

  private isValid(): boolean {
    return (
      this.name.trim() !== "" &&
      this.accountClass.trim() !== "" &&
      this.accountType.trim() !== "" &&
      this.currency.trim() !== ""
    );
  }

  public updateBalance(newBalance: number): void {
    this.currentBalance = newBalance;
  }

  public activate(): void {
    this.isActive = true;
  }

  public deactivate(): void {
    this.isActive = false;
  }
}

import mongoose, { Schema, Document } from "mongoose";

export interface AccountDocument extends Document {
  name: string;
  description?: string;
  accountClass: string;
  accountType: string;
  subType: string;
  code: string;
  isActive: boolean;
  fullyQualifiedName: string;
  currency: string;
  parentAccountId: string;
  isSubAccount: boolean;
  openingBalance: number;
  currentBalance: number;
  bankAccount?: string;
}

const AccountSchema: Schema<AccountDocument> = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    accountClass: { type: String, required: true },
    accountType: { type: String, required: true },
    subType: { type: String, required: true },
    code: { type: String, required: true },
    isActive: { type: Boolean, required: true, default: true },
    fullyQualifiedName: { type: String, required: true },
    currency: { type: String, required: true },
    // parentAccountId: {
    //   type: Schema.Types.ObjectId,
    //   ref: "Account",
    // },
    isSubAccount: { type: Boolean, required: true },
    openingBalance: { type: Number, required: true, default: 0 },
    currentBalance: { type: Number, required: true, default: 0 },
    bankAccount: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model<AccountDocument>("Account", AccountSchema);
