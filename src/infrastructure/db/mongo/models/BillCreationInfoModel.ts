import { Schema, model } from "mongoose";
import { BillCreationInfo, Branch } from "../../../../shared";

const billCreationInfoSchema = new Schema<BillCreationInfo>(
  {
    bill_date: { type: Date, required: true },
    customer_rfc: { type: Schema.Types.ObjectId, ref: "CustomerRFC" },
    branch: {
      type: String,
      enum: Object.values(Branch),
      default: Branch.Urban,
    },
    document_number: { type: String, required: true },
    status: { type: String, required: true },
    total: { type: Number, required: true },
    is_documented: { type: Boolean, default: false },
    payment_method: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    createdBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
    updatedAt: { type: Date, default: Date.now },
    updatedBy: { type: Schema.Types.ObjectId, ref: "Collaborator" },
  },
  { timestamps: true }
);

const billCreationInfoModel = model<BillCreationInfo>(
  "BillCreationInfo",
  billCreationInfoSchema
);

export default billCreationInfoModel;
