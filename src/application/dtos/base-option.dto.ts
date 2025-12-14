import { BaseOptionVOProps } from "../../domain";
import { checkForErrors } from "../../shared";
import { BaseDTO } from "./base.dto";

export class BaseOptionVODTO implements BaseDTO {
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

  static create(data: BaseOptionVOProps): BaseOptionVODTO {
    const { label, value } = data;

    const errors = [];
    if (!label) {
      errors.push("Label is required");
    }
    if (!value) {
      errors.push("Value is required");
    }

    checkForErrors(errors);
    return this.validate(data);
  }

  static update(data: BaseOptionVOProps): BaseOptionVODTO {
    return this.validate(data);
  }

  private static validate(data: BaseOptionVOProps): BaseOptionVODTO {
    return new BaseOptionVODTO({ ...data });
  }
}
