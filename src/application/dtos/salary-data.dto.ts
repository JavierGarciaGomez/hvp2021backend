import { BaseDTO } from "./base.dto";
import { SalaryDataProps } from "../../domain/entities";
import { ImssRates } from "../../domain";

export class SalaryDataDTO implements BaseDTO {
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

  static create(data: SalaryDataProps): SalaryDataDTO {
    const errors = [];
    const {
      year,
      minimumWage,
      uma,
      ocupationalRisk,
      imssEmployerRates,
      imssEmployeeRates,
    } = data;

    if (!year) {
      errors.push("Year is required");
    }

    if (!minimumWage) {
      errors.push("Minimum wage is required");
    }

    if (!uma) {
      errors.push("UMA is required");
    }

    if (!ocupationalRisk) {
      errors.push("Occupational risk is required");
    }

    if (!imssEmployerRates) {
      errors.push("IMSS employer rates is required");
    }

    if (!imssEmployeeRates) {
      errors.push("IMSS employee rates is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new SalaryDataDTO({ ...data });
  }

  static update(data: SalaryDataProps): SalaryDataDTO {
    return this.validate(data);
  }

  private static validate(data: SalaryDataProps): SalaryDataDTO {
    return new SalaryDataDTO({ ...data });
  }
}
