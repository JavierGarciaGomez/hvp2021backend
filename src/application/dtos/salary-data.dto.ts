import { BaseDTO } from "./base.dto";
import { SalaryDataProps } from "../../domain/entities";
import { ImssRates, isrRate } from "../../domain";

export class SalaryDataDTO implements BaseDTO {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  year!: number;
  minimumWage!: number;
  uma!: number;
  ocupationalRisk!: number;
  imssEmployerRates!: ImssRates;
  imssEmployeeRates!: ImssRates;
  minimumWageHVP!: number;
  employmentSubsidyLimit!: number;
  employmentSubsidyAmount!: number;
  // vars
  avgMonthlyOvertimeHours: number = 0;
  avgMonthlySundayHours: number = 0;
  avgMonthlyHolidayHours: number = 0;
  justifiedAbsenceCompensationPercent: number = 0;
  foodDayCompensation: number = 0;
  halfMonthIsrRates: isrRate[] = [];

  constructor({ ...props }: SalaryDataProps) {
    Object.assign(this, props);
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
