import { Document, Schema } from "mongoose";
import { ImssRates, isrRate } from "../value-objects";
import { BaseEntity, BaseEntityProps, newBaseEntityProps } from "./base.entity";

export interface SalaryDataBase extends newBaseEntityProps {
  year: number;
  minimumWage: number;
  uma: number;
  ocupationalRisk: number;
  imssEmployerRates: ImssRates;
  imssEmployeeRates: ImssRates;
  minimumWageHVP: number;
  employmentSubsidyLimit: number;
  employmentSubsidyAmount: number;
  // vars
  avgMonthlyOvertimeHours: number;
  avgMonthlySundayHours: number;
  avgMonthlyHolidayHours: number;
  justifiedAbsenceCompensationPercent: number;
  foodDayCompensation: number;
  halfMonthIsrRates: isrRate[];
}
export interface SalaryDataProps extends SalaryDataBase {
  createdBy?: string;
  updatedBy?: string;
}

export interface SalaryDataDocument extends SalaryDataBase, Document {
  id: Schema.Types.ObjectId;
  createdBy?: Schema.Types.ObjectId;
  updatedBy?: Schema.Types.ObjectId;
  halfMonthIsrRates: isrRate[];
}

export class SalaryDataEntity implements BaseEntity {
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

  constructor(props: SalaryDataProps) {
    Object.assign(this, props);
  }

  public static fromDocument(document: SalaryDataDocument) {
    const data = document.toObject<SalaryDataDocument>();
    const { _id, __v, ...rest } = data;
    return new SalaryDataEntity({
      ...rest,
      id: _id.toString(),
      createdBy: data.createdBy?.toString(),
      updatedBy: data.updatedBy?.toString(),
    });
  }
}
