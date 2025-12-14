import { Schema } from "mongoose";
import { TimeOffStatus, TimeOffType } from "../enums";
import { BaseEntity, BaseEntityProps } from "./base.entity";
import dayjs from "dayjs";

// export class TimeOffRequestEntity {
//   constructor(
//     public id: string,
//     public collaboratorId: string,
//     public startDate: Date,
//     public endDate: Date,
//     public status: "Pending" | "Approved" | "Rejected"
//   ) {}
// }

export interface TimeOffRequestProps extends BaseEntityProps {
  approvedAt?: Date;
  approvedBy?: string;
  collaborator: string;
  collaboratorNote?: string;
  managerNote?: string;
  requestedAt: Date;
  requestedDays: Date[];
  status: TimeOffStatus;
  timeOffType: TimeOffType;
}

export interface TimeOffRequestDocument
  extends Omit<
      TimeOffRequestProps,
      "id" | "createdBy" | "updatedBy" | "approvedBy" | "collaborator"
    >,
    Document {
  id: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  approvedBy: Schema.Types.ObjectId;
  collaborator: Schema.Types.ObjectId;
}

export class TimeOffRequestEntity implements BaseEntity {
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

  constructor(props: TimeOffRequestProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: TimeOffRequestDocument) {
    return new TimeOffRequestEntity({
      id: document.id.toString(),
      createdAt: document.createdAt,
      createdBy: document.createdBy.toString() || "",
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy ? document.updatedBy.toString() : "",
      approvedAt: document.approvedAt,
      approvedBy: document.approvedBy ? document.approvedBy.toString() : "",
      collaborator: document.collaborator.toString(),
      collaboratorNote: document.collaboratorNote,
      managerNote: document.managerNote,
      requestedAt: document.requestedAt,
      requestedDays: document.requestedDays,
      status: document.status,
      timeOffType: document.timeOffType,
    });
  }
}

export interface TimeOffRequestResponse extends TimeOffRequestEntity {}

export interface TimeOffRequestDayJs
  extends Omit<TimeOffRequestEntity, "requestedDays"> {
  requestedDays: dayjs.Dayjs[];
}
