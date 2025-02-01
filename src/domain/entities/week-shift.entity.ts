import { Document, Schema } from "mongoose";
import { CollaboratorDayShift } from "../value-objects/day-shift.vo";
import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface WeekShiftProps extends BaseEntityProps {
  startingDate: Date;
  endingDate: Date;
  shifts: CollaboratorDayShift[];
  isModel?: boolean;
  modelName?: string;
}

export interface WeekShiftDocument
  extends Omit<WeekShiftProps, "id" | "createdBy" | "updatedBy" | "shifts">,
    Document {
  id: Schema.Types.ObjectId;
  createdBy: Schema.Types.ObjectId;
  updatedBy: Schema.Types.ObjectId;
  shifts: (Omit<CollaboratorDayShift, "id"> & {
    id: Schema.Types.ObjectId;
  } & Document)[];
}

export class WeekShiftEntity implements BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  startingDate: Date;
  endingDate: Date;
  shifts: CollaboratorDayShift[];
  isModel?: boolean;
  modelName?: string;

  constructor({
    id,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
    startingDate,
    endingDate,
    shifts,
    isModel,
    modelName,
  }: WeekShiftProps) {
    this.id = id;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
    this.startingDate = startingDate;
    this.endingDate = endingDate;
    this.shifts = shifts;
    this.isModel = isModel;
    this.modelName = modelName;
  }

  public static fromDocument(document: WeekShiftDocument) {
    return new WeekShiftEntity({
      id: document.id.toString(),
      startingDate: document.startingDate,
      endingDate: document.endingDate,
      shifts: document.shifts.map((shift) => ({
        ...shift.toObject(), // Convert Mongoose document to plain object
        id: shift.id.toString(),
        collaboratorId: shift.collaboratorId.toString(),
        branchId: shift.branchId?.toString(),
      })),
      createdAt: document.createdAt,
      createdBy: document.createdBy.toString(),
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy?.toString(),
      isModel: document.isModel,
      modelName: document.modelName,
    });
  }
}
