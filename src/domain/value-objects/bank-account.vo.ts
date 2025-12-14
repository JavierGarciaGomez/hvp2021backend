import { Schema } from "mongoose";

export interface BankAccountVO {
  bankName: string;
  accountNumber: string;
  accountIban: string;
  accountType: string;
  accountClabe: string;
  branchIdentifier: string;
}

export const bankAccountSchema = new Schema({
  bankName: { type: String, required: false },
  accountNumber: { type: String, required: true },
  accountIban: { type: String, required: false },
  accountType: { type: String, required: false },
  accountClabe: { type: String, required: false },
  branchIdentifier: { type: String, required: false },
});
