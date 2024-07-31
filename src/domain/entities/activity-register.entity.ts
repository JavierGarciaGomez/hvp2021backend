import { ProductDocument } from "../../infrastructure";
import { ActivityRegisterDocument } from "../../infrastructure/db/mongo/models/activity-register.model";
import { BaseEntity } from "./base.entity";

export interface ActivityRegisterProps {
  id?: string;
  collaborator: string;
  // this is activityRegisterType
  activity: string;
  desc?: string;
  startingTime: Date;
  endingTime?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class ActivityRegisterEntity implements BaseEntity {
  id?: string;
  collaborator: string;
  // this is activityRegisterType
  activity: string;
  desc?: string;
  startingTime: Date;
  endingTime?: Date;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    collaborator,
    activity,
    desc,
    startingTime,
    endingTime,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: ActivityRegisterProps) {
    this.id = id;
    this.collaborator = collaborator;
    this.activity = activity;
    this.desc = desc;
    this.startingTime = startingTime;
    this.endingTime = endingTime;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(document: ActivityRegisterDocument) {
    return new ActivityRegisterEntity({
      id: document.id,
      collaborator: document.collaborator
        ? document.collaborator.toString()
        : "",
      activity: document.activity,
      desc: document.desc,
      startingTime: document.startingTime,
      endingTime: document.endingTime,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }

  public getDuration(): number {
    if (!this.endingTime) {
      return 0;
    }
    return this.endingTime.getTime() - this.startingTime.getTime();
  }

  public isStartingTimeBeforeEndingTime(): boolean {
    if (!this.endingTime) {
      return true;
    }
    return new Date(this.startingTime) < new Date(this.endingTime);
  }
}
