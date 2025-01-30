import { BaseDTO } from "./base.dto";
import { BaseEntity, EmploymentProps, JobProps } from "../../domain/entities";
import { ExtraCompensationVO, PaymentType } from "../../domain";

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
  jobEndDate?: Date;
  isActive!: boolean;
  weeklyHours!: number;
  paymentType: PaymentType = PaymentType.SALARY;
  seniorityBonusPercentage: number = 0;
  comissionBonusPercentage: number = 0;
  //
  fixedIncomeByPosition: number = 0;
  additionalFixedIncome: number = 0;
  fixedIncome: number = 0;
  minimumOrdinaryIncome: number = 0;
  //
  degreeBonus: number = 0;
  receptionBonus: number = 0;
  //
  trainingSupport: number = 0;
  physicalActivitySupport: number = 0;
  //
  contributionBaseSalary: number = 0;
  averageOrdinaryIncome: number = 0;
  averageIntegratedIncome: number = 0;
  averageComissionIncome: number = 0;
  extraCompensations: ExtraCompensationVO[] = [];

  constructor({ ...props }: EmploymentProps) {
    Object.assign(this, props);
  }

  static create(data: EmploymentProps): EmploymentDTO {
    const errors = [];

    const {
      seniorityBonusPercentage,
      comissionBonusPercentage,
      fixedIncome,
      minimumOrdinaryIncome,
    } = data;

    if (seniorityBonusPercentage === undefined) {
      errors.push("Seniority bonus percentage is required");
    }
    if (comissionBonusPercentage === undefined) {
      errors.push("Comission bonus percentage is required");
    }
    if (fixedIncome === undefined) {
      errors.push("Fixed perception is required");
    }
    if (minimumOrdinaryIncome === undefined) {
      errors.push("Minimum ordinary income is required");
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
