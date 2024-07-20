import { CollaboratorProps, CollaboratorRole } from "../../domain";
import { BaseError } from "../../shared";
import { isAlphabetical, isValidEnum } from "../../shared/helpers";
import { BaseDTO } from "./";

export class CollaboratorDTO implements BaseDTO {
  id?: string;
  first_name: string;
  last_name: string;
  role: CollaboratorRole;
  col_code: string;
  col_numId?: number;
  isActive: boolean;
  gender?: string;
  imgUrl?: string;
  accessCode?: string;
  isRegistered: boolean;
  email?: string;
  password?: string;
  position?: string;
  isDisplayedWeb: boolean;
  textPresentation?: string;
  registeredDate?: Date;
  lastLogin?: Date;
  startDate?: Date;
  endDate?: Date;
  vacationsTakenBefore2021?: number;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor(options: CollaboratorProps) {
    this.id = options.id;
    this.first_name = options.first_name;
    this.last_name = options.last_name;
    this.role = options.role;
    this.col_code = options.col_code;
    this.col_numId = options.col_numId;
    this.isActive = options.isActive;
    this.gender = options.gender;
    this.imgUrl = options.imgUrl;
    this.accessCode = options.accessCode;
    this.isRegistered = options.isRegistered;
    this.email = options.email;
    this.password = options.password;
    this.position = options.position;
    this.isDisplayedWeb = options.isDisplayedWeb;
    this.textPresentation = options.textPresentation;
    this.registeredDate = options.registeredDate;
    this.lastLogin = options.lastLogin;
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.vacationsTakenBefore2021 = options.vacationsTakenBefore2021;
    this.createdAt = options.createdAt;
    this.createdBy = options.createdBy;
    this.updatedAt = options.updatedAt;
    this.updatedBy = options.updatedBy;
  }

  static create(data: CollaboratorProps): CollaboratorDTO {
    const errors = this.validateCreate(data);
    if (errors.length > 0) {
      throw BaseError.badRequest(errors.join(", "));
    }
    return new CollaboratorDTO(data);
  }

  static update(data: CollaboratorProps): CollaboratorDTO {
    const errors = this.commonValidation(data);
    if (errors.length > 0) {
      throw BaseError.badRequest(errors.join(", "));
    }
    return new CollaboratorDTO(data);
  }

  static register(data: Partial<CollaboratorProps>): Partial<CollaboratorDTO> {
    const errors = this.validateRegister(data);
    if (errors.length > 0) {
      throw BaseError.badRequest(errors.join(", "));
    }
    return { ...data, isRegistered: true };
  }

  private static validateCreate(data: CollaboratorProps): string[] {
    const errors = this.commonValidation(data);
    if (!data.first_name) errors.push("First name is required");
    if (!data.last_name) errors.push("Last name is required");
    if (!data.role) errors.push("Role is required");
    if (!data.col_code) errors.push("Col code is required");
    if (data.isActive === undefined) errors.push("IsActive is required");
    return errors;
  }

  private static validateRegister(data: Partial<CollaboratorProps>): string[] {
    const errors = this.commonValidation(data);
    if (!data.email) errors.push("Email is required");
    if (!data.password) errors.push("Password is required");
    if (!data.col_code) errors.push("Col code is required");
    if (!data.accessCode) errors.push("Access code is required");
    return errors;
  }

  private static commonValidation(data: Partial<CollaboratorProps>): string[] {
    const errors = [];
    if (data.role && !isValidEnum(CollaboratorRole, data.role)) {
      errors.push("Role must be of type CollaboratorRole");
    }
    if (data.password && data.password.length < 6) {
      errors.push("Password must be at least 6 characters long");
    }
    if (data.col_code) {
      if (data.col_code.length !== 3)
        errors.push("Col code must be 3 characters long");
      if (!isAlphabetical(data.col_code))
        errors.push("Col code must be alphabetical");
    }
    return errors;
  }
}
