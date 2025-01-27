import { BaseDTO } from "./base.dto";
import {
  BranchReconciliationStatus,
  SimplifiedBranchCashReconciliationProps,
  TimeOffRequestProps,
  TimeOffStatus,
  TimeOffType,
} from "../../domain";
import { checkForErrors } from "../../shared";

export class TimeOffRequestDTO implements BaseDTO {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  approvedAt?: Date;
  approvedBy?: string;
  collaborator!: string;
  collaboratorNote?: string;
  managerNote?: string;
  requestedAt!: Date;
  requestedDays!: Date[];
  status!: TimeOffStatus;
  timeOffType!: TimeOffType;

  constructor({ ...props }: TimeOffRequestProps) {
    Object.assign(this, props);
  }

  static create(data: TimeOffRequestProps): TimeOffRequestDTO {
    const errors: string[] = [];
    let { collaborator, requestedDays, timeOffType, status } = data;

    if (!status) {
      status = TimeOffStatus.Pending;
    }

    if (!collaborator) {
      errors.push("Collaborator ID is required");
    }

    if (!requestedDays || requestedDays.length === 0) {
      errors.push("Requested days are required");
    }

    if (!Object.values(TimeOffType).includes(timeOffType)) {
      errors.push("Invalid time off type");
    }

    if (!Object.values(TimeOffStatus).includes(status)) {
      errors.push("Invalid time off status");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    checkForErrors(errors);

    return new TimeOffRequestDTO({ ...data });
  }

  static update(data: TimeOffRequestProps): TimeOffRequestDTO {
    return TimeOffRequestDTO.validate(data);
  }

  private static validate(data: TimeOffRequestProps): TimeOffRequestDTO {
    return new TimeOffRequestDTO({ ...data });
  }
}
