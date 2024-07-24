import { Document } from "mongoose";

interface Options {
  id?: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export abstract class BaseEntity {
  public id?: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public createdBy?: string;
  public updatedBy?: string;
}
