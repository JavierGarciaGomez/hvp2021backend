import { ImssRates } from "../value-objects";
import { BaseEntity, BaseEntityProps } from "./base.entity";

export interface SalaryDataProps extends BaseEntityProps {
  year: number;
  minimumWage: number;
  uma: number;
  ocupationalRisk: number;
  imssEmployerRates: ImssRates;
  imssEmployeeRates: ImssRates;
}

export interface SalaryDataDocument extends SalaryDataProps, Document {}

export class SalaryDataEntity implements BaseEntity {
  id?: string;
  year: number;
  minimumWage: number;
  uma: number;
  ocupationalRisk: number;
  imssEmployerRates: ImssRates;
  imssEmployeeRates: ImssRates;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;

  constructor({
    id,
    year,
    minimumWage,
    uma,
    ocupationalRisk,
    imssEmployerRates,
    imssEmployeeRates,
    createdAt,
    createdBy,
    updatedAt,
    updatedBy,
  }: SalaryDataProps) {
    this.id = id;
    this.year = year;
    this.minimumWage = minimumWage;
    this.uma = uma;
    this.ocupationalRisk = ocupationalRisk;
    this.imssEmployerRates = imssEmployerRates;
    this.imssEmployeeRates = imssEmployeeRates;
    this.createdAt = createdAt;
    this.createdBy = createdBy;
    this.updatedAt = updatedAt;
    this.updatedBy = updatedBy;
  }

  public static fromDocument(document: SalaryDataDocument) {
    return new SalaryDataEntity({
      id: document.id,
      year: document.year,
      minimumWage: document.minimumWage,
      uma: document.uma,
      ocupationalRisk: document.ocupationalRisk,
      imssEmployerRates: document.imssEmployerRates,
      imssEmployeeRates: document.imssEmployeeRates,
      createdAt: document.createdAt,
      createdBy: document.createdBy,
      updatedAt: document.updatedAt,
      updatedBy: document.updatedBy,
    });
  }
}
