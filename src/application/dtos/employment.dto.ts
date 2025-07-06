import { BaseDTO } from "./base.dto";
import { BaseEntity, EmploymentProps, JobProps } from "../../domain/entities";
import {
  HRAttendanceSource,
  HRPaymentType,
  PayrollConcept,
} from "../../domain";

export class EmploymentDTO implements BaseDTO, BaseEntity {
  id?: string;
  createdAt?: Date;
  createdBy?: string;
  updatedAt?: Date;
  updatedBy?: string;
  collaboratorId!: string;
  jobId!: string;
  employmentStartDate!: Date;
  employmentEndDate?: Date;
  isActive!: boolean;
  paymentType: HRPaymentType = HRPaymentType.SALARY;
  attendanceSource!: HRAttendanceSource;
  weeklyHours!: number;
  dailyWorkingHours!: number;
  workWeekRatio!: number;
  seniorityBonusPercentage: number = 0;
  commissionBonusPercentage: number = 0;
  employmentGuaranteedIncome!: number;
  employmentFixedIncomeByJob: number = 0;
  additionalFixedIncomes: PayrollConcept[] = [];
  additionalRoleFixedIncome: number = 0;
  complementaryFixedIncome: number = 0;
  employmentDegreeBonus: number = 0;
  employmentHourlyRate: number = 0;
  totalFixedIncome: number = 0;
  nominalDailyFixedIncome: number = 0;
  nominalHourlyFixedIncome: number = 0;
  effectiveDailyFixedIncome: number = 0;
  effectiveHourlyFixedIncome: number = 0;
  averageCommissionsPerScheduledHour: number = 0;
  averageOrdinaryIncomePerScheduledHour: number = 0;
  trainingSupport: number = 0;
  physicalActivitySupport: number = 0;
  contributionBaseSalary: number = 0;
  otherDeductions: PayrollConcept[] = [];

  constructor({ ...props }: EmploymentProps) {
    Object.assign(this, props);
  }

  static create(data: EmploymentProps): EmploymentDTO {
    const errors = [];

    const {
      collaboratorId,
      jobId,
      employmentStartDate,
      isActive,
      weeklyHours,
      dailyWorkingHours,
      workWeekRatio,
      employmentGuaranteedIncome,
    } = data;

    if (!collaboratorId) {
      errors.push("Collaborator ID is required");
    }
    if (!jobId) {
      errors.push("Job ID is required");
    }
    if (!employmentStartDate) {
      errors.push("Employment start date is required");
    }
    if (isActive === undefined) {
      errors.push("Active status is required");
    }
    if (!weeklyHours) {
      errors.push("Weekly hours is required");
    }
    if (!dailyWorkingHours) {
      errors.push("Daily working hours is required");
    }
    if (!workWeekRatio) {
      errors.push("Work week ratio is required");
    }
    if (!employmentGuaranteedIncome) {
      errors.push("Employment guaranteed income is required");
    }

    if (errors.length) {
      throw new Error(errors.join(", "));
    }

    return new EmploymentDTO({ ...data });
  }

  static update(data: EmploymentProps): EmploymentDTO {
    return this.validate(data);
  }

  private static validate(data: EmploymentProps): EmploymentDTO {
    return new EmploymentDTO({ ...data });
  }
}
