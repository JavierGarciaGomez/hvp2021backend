import { BaseDTO } from "./base.dto";
import { BaseEntity, PayrollProps, PayrollStatus } from "../../domain";
import {
  PayrollGeneralData,
  PayrollEarnings,
  PayrollDeductions,
  PayrollTotals,
  PayrollContextData,
} from "../../domain/value-objects";

export class PayrollDTO implements BaseDTO, BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  collaboratorId!: string;
  jobId?: string;
  payrollStatus: PayrollStatus = PayrollStatus.Pending;
  periodStartDate!: Date;
  periodEndDate!: Date;
  generalData!: PayrollGeneralData;
  earnings!: PayrollEarnings;
  deductions!: PayrollDeductions;
  totals!: PayrollTotals;
  contextData!: PayrollContextData;

  constructor({ ...props }: PayrollProps) {
    Object.assign(this, props);
  }

  static create(data: PayrollProps): PayrollDTO {
    const errors = [];

    const { collaboratorId, generalData, periodStartDate, periodEndDate } =
      data;

    if (collaboratorId === undefined) {
      errors.push("Collaborator ID is required");
    }
    if (periodStartDate === undefined) {
      errors.push("Period start date is required");
    }
    if (periodEndDate === undefined) {
      errors.push("Period end date is required");
    }
    if (!generalData) {
      errors.push("General data is required");
    } else {
      if (!generalData.fullName) {
        errors.push("Collaborator full name is required");
      }
      if (!generalData.collaboratorCode) {
        errors.push("Collaborator code is required");
      }
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new PayrollDTO({ ...data });
  }

  static update(data: PayrollProps): PayrollDTO {
    return this.validate(data);
  }

  private static validate(data: PayrollProps): PayrollDTO {
    return new PayrollDTO({ ...data });
  }
}
