import { Schema, model } from "mongoose";
import { AddressSchema, CustomerDocument } from "../../../../domain";
import { linkedTransactionSchema } from "../../../../domain/value-objects/linkedTransaction.vo";

const customerSchema = new Schema<CustomerDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    secondLastName: { type: String, required: true },
    birthDate: { type: Date, required: true },
    address: { type: AddressSchema, required: false },
    phoneNumber: { type: [String], required: false },
    email: { type: String, required: false },
    qvetNumber: { type: String, required: false },
    balance: { type: Number, required: false },
    isActive: { type: Boolean, required: true },
  },
  {
    timestamps: {
      createdAt: "createdAt",
      updatedAt: "updatedAt",
    },
  }
);

export const CustomerModel = model<CustomerDocument>(
  "Customer",
  customerSchema
);
