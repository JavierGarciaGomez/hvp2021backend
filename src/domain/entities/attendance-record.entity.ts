import { Schema, Document } from "mongoose";
import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface AttendanceRecordProps extends BaseEntityProps {
  shiftDate: Date;
  startTime: Date;
  endTime?: Date;
  clockInBranch: string;
  clockOutBranch?: string;
  collaborator: string;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;
}

export interface AttendanceRecordDocument
  extends Omit<
      AttendanceRecordProps,
      | "id"
      | "clockInBranch"
      | "clockOutBranch"
      | "collaborator"
      | "createdBy"
      | "updatedBy"
    >,
    Document {
  id: Schema.Types.ObjectId;
  clockInBranch: Schema.Types.ObjectId;
  clockOutBranch?: Schema.Types.ObjectId;
  collaborator: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
}

export class AttendanceRecordEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  shiftDate: Date;
  startTime: Date;
  endTime?: Date;
  clockInBranch: string;
  clockOutBranch?: string;
  collaborator: string;
  startLatitude?: number;
  startLongitude?: number;
  endLatitude?: number;
  endLongitude?: number;

  constructor({
    id,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    shiftDate,
    startTime,
    endTime,
    clockInBranch,
    clockOutBranch,
    collaborator,
    startLatitude,
    startLongitude,
    endLatitude,
    endLongitude,
  }: AttendanceRecordProps) {
    this.id = id;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.shiftDate = shiftDate;
    this.startTime = startTime;
    this.endTime = endTime;
    this.clockInBranch = clockInBranch;
    this.clockOutBranch = clockOutBranch;
    this.collaborator = collaborator;
    this.startLatitude = startLatitude;
    this.startLongitude = startLongitude;
    this.endLatitude = endLatitude;
    this.endLongitude = endLongitude;
  }

  public static fromDocument(
    document: AttendanceRecordDocument
  ): AttendanceRecordEntity {
    return new AttendanceRecordEntity({
      id: document.id.toString(),
      shiftDate: document.shiftDate,
      startTime: document.startTime,
      endTime: document.endTime,
      clockInBranch: document.clockInBranch?.toString(),
      clockOutBranch: document.clockOutBranch?.toString(),
      collaborator: document.collaborator.toString(),
      createdAt: document.createdAt,
      createdBy: document.createdBy?.toString(),
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy?.toString(),
      startLatitude: document.startLatitude,
      startLongitude: document.startLongitude,
      endLatitude: document.endLatitude,
      endLongitude: document.endLongitude,
    });
  }
}
