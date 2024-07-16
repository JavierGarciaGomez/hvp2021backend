import { Document } from "mongoose";
import { IUser } from "../../infra/db/mongo/models/user.model";
import { UserRole } from "../enums/user.enums";
import { BaseEntity } from "./base.entity";

export interface UserOptions {
  id?: string;
  email: string;
  roles: UserRole[];
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;
}

export type UserDocument = UserOptions & Document;
const aababa: UserDocument = {
  email: "test",
  password: "test",
  roles: [UserRole.USER], // Add the roles property
  createdAt: new Date(),
  updatedAt: new Date(),
  createdBy: "test",
  id: "test",
};

console.log({ x: aababa });

export interface UserDocument3 extends Omit<UserOptions, "id">, Document {
  id: string; // Ensure this matches the type expected by Document
}

export class UserEntity implements BaseEntity {
  id?: string;
  email: string;
  roles: UserRole[];
  password: string;
  createdAt?: Date;
  updatedAt?: Date;
  createdBy?: string;
  updatedBy?: string;

  constructor(options: IUser) {
    this.email = options.email;
    this.id = options.id;
    this.createdAt = options.createdAt;
    this.updatedAt = options.updatedAt;
    this.createdBy = options.createdBy;
    this.updatedBy = options.updatedBy;
  }

  public static fromDocument(document: IUser): UserEntity {
    return new UserEntity({
      id: document.id,
      email: document.email,
      roles: document.roles,
      password: document.password,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
      createdBy: document.createdBy,
      updatedBy: document.updatedBy,
    });
  }
}
