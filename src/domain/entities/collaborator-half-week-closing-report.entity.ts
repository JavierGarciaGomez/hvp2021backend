import { Document, Schema } from "mongoose";
import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface InvalidClosingDetail {
  id: string;
  reason: string;
  date: Date;
}

export interface InvalidWithdrawalDetail {
  id: string;
  reason: string;
  date: Date;
}

export interface CollaboratorHalfWeekClosingReportProps
  extends BaseEntityProps {
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
  invalidClosingsDetails: InvalidClosingDetail[];
  invalidWithdrawalsDetails: InvalidWithdrawalDetail[];
}

export interface CollaboratorHalfWeekClosingReportDocument
  extends Omit<CollaboratorHalfWeekClosingReportProps, "id" | "collaboratorId">,
    Document {
  id: Schema.Types.ObjectId;
  collaboratorId: Schema.Types.ObjectId;
}

export class CollaboratorHalfWeekClosingReportEntity implements BaseEntity {
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
  invalidClosingsDetails: InvalidClosingDetail[];
  invalidWithdrawalsDetails: InvalidWithdrawalDetail[];
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
    this.invalidClosingsDetails = options.invalidClosingsDetails;
    this.invalidWithdrawalsDetails = options.invalidWithdrawalsDetails;
    this.createdAt = options.createdAt;
    this.createdBy = options.createdBy;
    this.updatedAt = options.updatedAt;
    this.updatedBy = options.updatedBy;
  }

  static fromDocument(
    document: CollaboratorHalfWeekClosingReportDocument
  ): CollaboratorHalfWeekClosingReportEntity {
    return new CollaboratorHalfWeekClosingReportEntity({
      id: document._id.toString(),
      collaboratorId: document.collaboratorId.toString(),
      halfWeekStartDate: document.halfWeekStartDate,
      halfWeekEndDate: document.halfWeekEndDate,
      smallClosings: document.smallClosings,
      largeClosings: document.largeClosings,
      totalClosings: document.totalClosings,
      invalidClosings: document.invalidClosings,
      invalidWithdrawals: document.invalidWithdrawals,
      bonusEarned: document.bonusEarned,
      bonusDeducted: document.bonusDeducted,
      totalBonus: document.totalBonus,
      invalidClosingsDetails: document.invalidClosingsDetails,
      invalidWithdrawalsDetails: document.invalidWithdrawalsDetails,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }

  static toDocument(entity: CollaboratorHalfWeekClosingReportEntity): any {
    return {
      collaboratorId: entity.collaboratorId,
      halfWeekStartDate: entity.halfWeekStartDate,
      halfWeekEndDate: entity.halfWeekEndDate,
      smallClosings: entity.smallClosings,
      largeClosings: entity.largeClosings,
      totalClosings: entity.totalClosings,
      invalidClosings: entity.invalidClosings,
      invalidWithdrawals: entity.invalidWithdrawals,
      bonusEarned: entity.bonusEarned,
      bonusDeducted: entity.bonusDeducted,
      totalBonus: entity.totalBonus,
      invalidClosingsDetails: entity.invalidClosingsDetails,
      invalidWithdrawalsDetails: entity.invalidWithdrawalsDetails,
      createdAt: entity.createdAt,
      createdBy: entity.createdBy,
      updatedAt: entity.updatedAt,
      updatedBy: entity.updatedBy,
    };
  }
}

export interface CollaboratorHalfWeekClosingReportResponse
  extends CollaboratorHalfWeekClosingReportProps {}
