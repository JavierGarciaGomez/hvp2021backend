import { Document, Schema } from "mongoose";
import { HRPaymentType, PayrollStatus } from "../enums";
import { BaseEntity, newBaseEntityProps } from "./base.entity";
import {
  PayrollConcept,
  PayrollGeneralData,
  PayrollEarnings,
  PayrollDeductions,
  PayrollTotals,
  PayrollContextData,
} from "../value-objects";

export interface PayrollBase extends newBaseEntityProps {
  collaboratorId: string | Schema.Types.ObjectId;
  jobId?: string | Schema.Types.ObjectId;
  employmentId?: string | Schema.Types.ObjectId;
  payrollStatus?: PayrollStatus;
  periodStartDate: Date;
  periodEndDate: Date;
  generalData: PayrollGeneralData;
  earnings: PayrollEarnings;
  deductions: PayrollDeductions;
  totals: PayrollTotals;
  contextData: PayrollContextData;
}

export interface PayrollProps extends PayrollBase {
  id?: string;
  createdBy?: string;
  updatedBy?: string;
  collaboratorId: string;
  jobId?: string;
  employmentId?: string;
  payrollStatus?: PayrollStatus;
  periodStartDate: Date;
  periodEndDate: Date;
}

export interface PayrollDocument extends PayrollBase, Document {
  id: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  collaboratorId: Schema.Types.ObjectId;
  jobId: Schema.Types.ObjectId;
}

export class PayrollEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  collaboratorId!: string;
  payrollStatus: PayrollStatus = PayrollStatus.Pending;
  periodStartDate!: Date;
  periodEndDate!: Date;
  generalData!: PayrollGeneralData;
  earnings!: PayrollEarnings;
  deductions!: PayrollDeductions;
  totals!: PayrollTotals;
  contextData!: PayrollContextData;

  constructor(props: PayrollProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: PayrollDocument) {
    const data = document.toObject<PayrollDocument>();
    const { _id, __v, ...rest } = data;
    return new PayrollEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
      collaboratorId: data.collaboratorId?.toString(),
      jobId: data.jobId?.toString(),
      employmentId: data.employmentId?.toString(),
    });
  }
}

export interface PayrollResponse extends PayrollEntity {}
