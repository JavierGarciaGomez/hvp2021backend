// import { ICollaborator } from "../../infra/db/mongo/models/collaborator.model";
import { CollaboratorDocument } from "../../infrastructure/db/mongo/models/collaborator.model";
import { CollaboratorAuth } from "../../shared";
import { Degree, Gender, WebAppRole } from "../enums";
import { PaymentType } from "../enums/job.enums";
import { AddressVO, ImageUrl } from "../value-objects";
import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface CollaboratorProps extends BaseEntityProps {
  // General information
  // remove this
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
  images?: ImageUrl[];
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

  // TODO: enum
}

export interface PublicCollaborator extends Partial<CollaboratorProps> {
  id?: string;
  first_name: string;
  last_name: string;
  col_code: string;
  position?: string;
  imgUrl?: string;
  images?: ImageUrl[];
  textPresentation?: string;
}

// todo response interface

export class CollaboratorEntity implements BaseEntity {
  // General information
  // remove this
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
  images?: ImageUrl[];
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

  // TODO: enum
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor(options: CollaboratorProps) {
    this._id = options._id;
    this.id = options.id;
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
    this.images = options.images;
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

  static fromDocument(document: CollaboratorDocument): CollaboratorEntity {
    return new CollaboratorEntity({
      _id: document.id,
      id: document.id,
      first_name: document.first_name,
      last_name: document.last_name,
      gender: document.gender,
      email: document.email,
      phoneNumber: document.phoneNumber,
      phoneNumber2: document.phoneNumber2,
      address: document.address,
      curp: document.curp,
      imssNumber: document.imssNumber,
      rfcCode: document.rfcCode,
      emergencyContact: document.emergencyContact,
      emergencyContactPhone: document.emergencyContactPhone,
      role: document.role,
      imgUrl: document.imgUrl,
      images: document.images,
      accessCode: document.accessCode,
      isRegistered: document.isRegistered,
      password: document.password,
      isDisplayedWeb: document.isDisplayedWeb,
      textPresentation: document.textPresentation,
      registeredDate: document.registeredDate,
      lastLogin: document.lastLogin,
      vacationsTakenBefore2021: document.vacationsTakenBefore2021,
      col_code: document.col_code,
      col_numId: document.col_numId,
      isActive: document.isActive,
      startDate: document.startDate,
      endDate: document.endDate,
      position: document.position,
      coverShift: document.coverShift,
      weeklyHours: document.weeklyHours,
      jobId: document.jobId,
      contractDate: document.contractDate,
      hasIMSS: document.hasIMSS,
      imssEnrollmentDate: document.imssEnrollmentDate,
      paymentType: document.paymentType,
      additionalCompensation: document.additionalCompensation,
      degree: document.degree,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }

  public toPublicCollaborator(): PublicCollaborator {
    return {
      id: this.id,
      first_name: this.first_name,
      last_name: this.last_name,
      col_code: this.col_code,
      position: this.position,
      imgUrl: this.imgUrl,
      images: this.images,
      textPresentation: this.textPresentation,
    };
  }

  public toCollaboratorAuth(): CollaboratorAuth {
    return {
      uid: this.id!,
      col_code: this.col_code,
      role: this.role,
      // todo: this should be main image
      imgUrl: this.imgUrl,
    };
  }
}

// export class CollaboratorResponse extends CollaboratorEntity {
//   baseContributionSalary?: number;
//   dailyAverageSalary: number;
//   accumulatedAnnualIncomeRaisePercent: number;
//   accumulatedAnnualComissionRaisePercent: number;
//   aggregatedMonthlyIncome: number;
//   imssSalaryBase: number;
//   averageDailyIncome: number;

//   constructor(options: CollaboratorProps) {
//     super(options);
//     this.baseContributionSalary = 10;
//     this.dailyAverageSalary = 10;
//     this.accumulatedAnnualIncomeRaisePercent = 10;
//     this.accumulatedAnnualComissionRaisePercent = 10;
//     this.aggregatedMonthlyIncome = 10;
//     this.imssSalaryBase = 10;
//     this.averageDailyIncome = 10;
//   }

//   static fromDocument(document: CollaboratorDocument): CollaboratorResponse {
//     return new CollaboratorResponse(document);
//   }
// }

export interface CollaboratorResponse extends CollaboratorProps {
  baseContributionSalary?: number;
  dailyAverageSalary: number;
  accumulatedAnnualIncomeRaisePercent: number;
  accumulatedAnnualComissionRaisePercent: number;
  aggregatedMonthlyIncome: number;
  imssSalaryBase: number;
  averageDailyIncome: number;
}
