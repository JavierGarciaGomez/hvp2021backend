import {
  CollaboratorHalfWeekClosingReportProps,
  InvalidDetail,
} from "../../domain";
import { BaseError } from "../../shared";
import { checkForErrors } from "../../shared/helpers";
import { BaseDTO } from "./base.dto";

export class CollaboratorHalfWeekClosingReportDTO implements BaseDTO {
  id?: string;
  collaboratorId: string;
  halfWeekStartDate: Date;
  halfWeekEndDate: Date;
  smallClosings: number;
  largeClosings: number;
  totalClosings: number;
  invalidClosings: number;
  invalidWithdrawals: number;
  bonusEarned: number;
  bonusDeducted: number;
  totalBonus: number;
  invalidClosingsDetails: InvalidDetail[];
  invalidWithdrawalsDetails: InvalidDetail[];
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor(options: CollaboratorHalfWeekClosingReportProps) {
    this.id = options.id;
    this.collaboratorId = options.collaboratorId;
    this.halfWeekStartDate = options.halfWeekStartDate;
    this.halfWeekEndDate = options.halfWeekEndDate;
    this.smallClosings = options.smallClosings;
    this.largeClosings = options.largeClosings;
    this.totalClosings = options.totalClosings;
    this.invalidClosings = options.invalidClosings;
    this.invalidWithdrawals = options.invalidWithdrawals;
    this.bonusEarned = options.bonusEarned;
    this.bonusDeducted = options.bonusDeducted;
    this.totalBonus = options.totalBonus;
    this.invalidClosingsDetails = options.invalidClosingsDetails || [];
    this.invalidWithdrawalsDetails = options.invalidWithdrawalsDetails || [];
    this.createdAt = options.createdAt;
    this.createdBy = options.createdBy;
    this.updatedAt = options.updatedAt;
    this.updatedBy = options.updatedBy;
  }

  static create(
    data: CollaboratorHalfWeekClosingReportProps
  ): CollaboratorHalfWeekClosingReportDTO {
    const errors = this.validateCreate(data);
    checkForErrors(errors);
    return new CollaboratorHalfWeekClosingReportDTO(data);
  }

  static update(
    data: CollaboratorHalfWeekClosingReportProps
  ): CollaboratorHalfWeekClosingReportDTO {
    const errors = this.validateUpdate(data);
    checkForErrors(errors);
    return new CollaboratorHalfWeekClosingReportDTO(data);
  }

  private static validateCreate(
    data: CollaboratorHalfWeekClosingReportProps
  ): string[] {
    const errors = this.commonValidation(data);
    if (!data.collaboratorId) errors.push("Collaborator ID is required");
    if (!data.halfWeekStartDate)
      errors.push("Half week start date is required");
    if (!data.halfWeekEndDate) errors.push("Half week end date is required");
    if (data.smallClosings === undefined)
      errors.push("Small closings is required");
    if (data.largeClosings === undefined)
      errors.push("Large closings is required");
    if (data.totalClosings === undefined)
      errors.push("Total closings is required");
    if (data.invalidClosings === undefined)
      errors.push("Invalid closings is required");
    if (data.invalidWithdrawals === undefined)
      errors.push("Invalid withdrawals is required");
    if (data.bonusEarned === undefined) errors.push("Bonus earned is required");
    if (data.bonusDeducted === undefined)
      errors.push("Bonus deducted is required");
    if (data.totalBonus === undefined) errors.push("Total bonus is required");
    return errors;
  }

  private static validateUpdate(
    data: CollaboratorHalfWeekClosingReportProps
  ): string[] {
    const errors = this.commonValidation(data);
    return errors;
  }

  private static commonValidation(
    data: Partial<CollaboratorHalfWeekClosingReportProps>
  ): string[] {
    const errors: string[] = [];

    if (data.halfWeekStartDate && data.halfWeekEndDate) {
      if (data.halfWeekStartDate >= data.halfWeekEndDate) {
        errors.push("Half week start date must be before end date");
      }
    }

    if (data.smallClosings !== undefined && data.smallClosings < 0) {
      errors.push("Small closings must be a non-negative number");
    }

    if (data.largeClosings !== undefined && data.largeClosings < 0) {
      errors.push("Large closings must be a non-negative number");
    }

    if (data.totalClosings !== undefined && data.totalClosings < 0) {
      errors.push("Total closings must be a non-negative number");
    }

    if (data.invalidClosings !== undefined && data.invalidClosings < 0) {
      errors.push("Invalid closings must be a non-negative number");
    }

    if (data.invalidWithdrawals !== undefined && data.invalidWithdrawals < 0) {
      errors.push("Invalid withdrawals must be a non-negative number");
    }

    if (data.bonusEarned !== undefined && data.bonusEarned < 0) {
      errors.push("Bonus earned must be a non-negative number");
    }

    if (data.bonusDeducted !== undefined && data.bonusDeducted < 0) {
      errors.push("Bonus deducted must be a non-negative number");
    }

    // Note: totalBonus can be negative (if deducted > earned), so no validation for that

    return errors;
  }
}
