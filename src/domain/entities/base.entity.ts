import { Schema } from "mongoose";

export interface BaseEntityProps {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export interface BaseEntityConstructor<T extends BaseEntity> {
  new (data: any): T; // Add constructor signature
  fromDocument(data: any): T;
}

export interface newBaseEntityProps {
  id?: string | Schema.Types.ObjectId;
  createdAt?: Date;
  createdBy?: string | Schema.Types.ObjectId;
  updatedAt?: Date;
  updatedBy?: string | Schema.Types.ObjectId;
}
