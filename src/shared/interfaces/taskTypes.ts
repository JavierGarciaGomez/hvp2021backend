import { Schema } from "mongoose";

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
  isRestrictedView: boolean;
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
  Accounting = "Accounting",
  Advertising = "Advertising",
  Billing = "Billing",
  Customers = "Customers",
  Documentation = "Documentation",
  Equipment = "Equipment",
  Events = "Events",
  FileManagement = "File management",
  General = "General",
  HumanResources = "HR",
  Inventory = "Inventory",
  Maintenance = "Maintenance",
  Petco = "Petco",
  Qvet = "Qvet",
  Reports = "Reports",
  SocialMedia = "Social media",
  SocialSecurity = "Social security",
  Suppliers = "Suppliers",
  Taxes = "Taxes",
  WebApp = "Web app",
}
