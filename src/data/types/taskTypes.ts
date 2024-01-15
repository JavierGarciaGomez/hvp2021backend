import { Schema } from "mongoose";
import { AttendanceType } from "./attendanceTypes";

export interface Task extends Document {
  _id?: Schema.Types.ObjectId;
  activities?: TaskActivity[];
  assignees?: Schema.Types.ObjectId;
  author: Schema.Types.ObjectId;
  completedAt?: string;
  completionCriteria?: string[];
  createdAt?: Date;
  createdBy?: Schema.Types.ObjectId;
  description?: string;
  dueDate?: Date;
  notes?: string;
  number?: number;
  priority: TaskPriority;
  requestedAt?: Date;
  status: TaskStatus;
  tags?: TaskTag[];
  title: string;
  updatedAt?: Date;
  updatedBy?: Date;
}

export interface TaskActivity {
  _id?: Schema.Types.ObjectId;
  createdAt?: Date;
  createdBy?: Schema.Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: Schema.Types.ObjectId;
  content: string;
  registeredAt: Date;
  author: Schema.Types.ObjectId;
}

export enum TaskPriority {
  High = "High",
  Medium = "Medium",
  Low = "Low",
  Exploratory = "Exploratory",
}

export enum TaskStatus {
  Backlog = "Backlog",
  OnHold = "On hold",
  Next = "Next",
  InProgress = "In progress",
  InReview = "In review",
  Completed = "Completed",
  Canceled = "Canceled",
}

export enum TaskTag {
  Maintenance = "Maintenance",
  Inventory = "Inventory",
  Suppliers = "Suppliers",
  Customers = "Customers",
  Petco = "Petco",
  HumanResources = "HR",
  Billing = "Billing",
  Reports = "Reports",
  Advertising = "Advertising",
  SocialMedia = "Social media",
  Events = "Events",
  WebApp = "Web app",
  Qvet = "Qvet",
  General = "General",
}
