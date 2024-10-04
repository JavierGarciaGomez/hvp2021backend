import {
  AddressVO,
  CollaboratorProps,
  Degree,
  Gender,
  PaymentType,
  WebAppRole,
} from "../../domain";
import { BaseError } from "../../shared";
import {
  checkForErrors,
  generateRandomPassword,
  isAlphabetical,
  isValidEnum,
} from "../../shared/helpers";
import { BaseDTO } from "./";

export class CollaboratorDTO implements BaseDTO {
  id?: string;
  _id?: string;
  first_name: string;
  last_name: string;
  gender?: Gender;
  email?: string;
  phoneNumber?: string;
  phoneNumber2?: string;
  address?: AddressVO;
  curp?: string;
  imssNumber?: string;
  rfcCode?: string;
  emergencyContact?: string;
  emergencyContactPhone?: string;

  // webApp information
  role: WebAppRole;
  imgUrl?: string;
  accessCode?: string;
  isRegistered: boolean;
  password?: string;
  isDisplayedWeb: boolean;
  textPresentation?: string;
  registeredDate?: Date;
  // TODO: remove this
  lastLogin?: Date;
  vacationsTakenBefore2021?: number;

  // Job information
  col_code: string;
  col_numId?: number;
  // this could be computed
  isActive: boolean;
  startDate?: Date;
  endDate?: Date;
  // TODO: remove this
  position?: string;
  coverShift?: boolean;
  weeklyHours?: number;
  jobId?: string;
  contractDate?: Date;
  hasIMSS?: boolean;
  imssEnrollmentDate?: Date;
  // Payroll information
  // TODO: set in a parameter the value of the compensation
  paymentType?: PaymentType;
  additionalCompensation?: number; // based in the hours he goes
  // TODO: enum
  degree?: Degree;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor(options: CollaboratorProps) {
    this.id = options.id;
    this._id = options._id;
    this.first_name = options.first_name;
    this.last_name = options.last_name;
    this.gender = options.gender;
    this.email = options.email;
    this.phoneNumber = options.phoneNumber;
    this.phoneNumber2 = options.phoneNumber2;
    this.address = options.address;
    this.curp = options.curp;
    this.imssNumber = options.imssNumber;
    this.rfcCode = options.rfcCode;
    this.emergencyContact = options.emergencyContact;
    this.emergencyContactPhone = options.emergencyContactPhone;
    this.role = options.role;
    this.imgUrl = options.imgUrl;
    this.accessCode = options.accessCode;
    this.isRegistered = options.isRegistered;
    this.password = options.password;
    this.isDisplayedWeb = options.isDisplayedWeb;
    this.textPresentation = options.textPresentation;
    this.registeredDate = options.registeredDate;
    this.lastLogin = options.lastLogin;
    this.vacationsTakenBefore2021 = options.vacationsTakenBefore2021;
    this.col_code = options.col_code;
    this.col_numId = options.col_numId;
    this.isActive = options.isActive;
    this.startDate = options.startDate;
    this.endDate = options.endDate;
    this.position = options.position;
    this.coverShift = options.coverShift;
    this.weeklyHours = options.weeklyHours;
    this.jobId = options.jobId;
    this.contractDate = options.contractDate;
    this.hasIMSS = options.hasIMSS;
    this.imssEnrollmentDate = options.imssEnrollmentDate;
    this.paymentType = options.paymentType;
    this.additionalCompensation = options.additionalCompensation;
    this.degree = options.degree;
    this.createdAt = options.createdAt;
    this.createdBy = options.createdBy;
    this.updatedAt = options.updatedAt;
    this.updatedBy = options.updatedBy;
  }

  static create(data: CollaboratorProps): CollaboratorDTO {
    const errors = this.validateCreate(data);
    const accessCode = generateRandomPassword();
    data.accessCode = accessCode;
    checkForErrors(errors);
    return new CollaboratorDTO(data);
  }

  static update(data: CollaboratorProps): CollaboratorDTO {
    const errors = this.commonValidation(data);
    checkForErrors(errors);
    return new CollaboratorDTO(data);
  }

  static register(data: Partial<CollaboratorProps>): Partial<CollaboratorDTO> {
    const errors = this.validateRegister(data);
    checkForErrors(errors);
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
    const errors: string[] = [];
    if (data.role && !isValidEnum(WebAppRole, data.role)) {
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
