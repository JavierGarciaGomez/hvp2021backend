import { BaseOptionDocument } from "../../shared";
import { BaseVO } from "./base.vo";

export interface BaseOptionVOProps {
  id?: string;
  label: string;
  value: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
}

export class BaseOptionVO implements BaseVO {
  id?: string;
  label: string;
  value: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    label,
    value,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: BaseOptionVOProps) {
    this.id = id;
    this.label = label;
    this.value = value;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  static fromDocument(document: BaseOptionDocument): BaseOptionVO {
    return new BaseOptionVO({
      id: document.id,
      label: document.label,
      value: document.value,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
