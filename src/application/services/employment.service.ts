import { EmploymentEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import {
  EmploymentRepository,
  HRPaymentType,
  HRAttendanceSource,
  Degree,
  DraftEmploymentReadModel,
} from "../../domain";
import { EmploymentDTO } from "../dtos";
import {
  AuthenticatedCollaborator,
  VACATION_BONUS_PERCENTAGE,
  calculateVacationsForYearAfter2022,
  WORKING_DAYS_IN_A_WEEK,
  MAX_WORK_WEEK_LIMIT,
  ANNUAL_RAISE_PERCENT,
  COMMISSION_SENIORITY_BONUS_PER_SEMESTER,
  AVERAGE_WORK_DAYS_PER_MONTH,
  DEGREE_BONUS,
} from "../../shared";

import dayjs from "dayjs";
import {
  createCollaboratorService,
  createCommissionAllocationService,
  createJobService,
  createSalaryDataService,
} from "../factories";

export class EmploymentService extends BaseService<
  EmploymentEntity,
  EmploymentDTO
> {
  private readonly salaryDataService = createSalaryDataService();
  private readonly jobService = createJobService();
  private readonly commissionService = createCommissionAllocationService();
  private readonly collaboratorService = createCollaboratorService();

  constructor(protected readonly repository: EmploymentRepository) {
    super(repository, EmploymentEntity);
  }

  public getResourceName(): string {
    return "employment";
  }

  public createManyFromDTOs = async (
    data: EmploymentDTO[],
    authUser?: AuthenticatedCollaborator
  ): Promise<EmploymentEntity[]> => {
    const results: EmploymentEntity[] = [];
    const updatesNeeded = new Map<string, { id: string; data: any }>();

    // First pass: validate all employment conflicts and prepare operations
    for (const employmentData of data) {
      const entity = new this.entityClass(employmentData);
      const newEmploymentStartDate = new Date(entity.employmentStartDate);

      // 1. Handle previous employment conflicts
      const previousEmployment =
        await this.getEmploymentByCollaboratorBeforeDate(
          employmentData.collaboratorId,
          entity.employmentStartDate.toString()
        );

      if (
        previousEmployment &&
        (!previousEmployment.employmentEndDate ||
          new Date(previousEmployment.employmentEndDate) >=
            newEmploymentStartDate)
      ) {
        // Use Map to avoid duplicate updates to the same employment
        updatesNeeded.set(previousEmployment.id!, {
          id: previousEmployment.id!,
          data: {
            ...previousEmployment,
            isActive: false,
            employmentEndDate: new Date(newEmploymentStartDate.getTime() - 1),
          },
        });
      }

      // 2. Handle future employment conflicts
      const futureEmployments = await this.getAll({
        filteringDto: {
          collaboratorId: employmentData.collaboratorId,
          employmentStartDate: { $gt: entity.employmentStartDate },
        },
        sortingDto: {
          sort_by: "employmentStartDate",
          direction: "asc",
        },
      });

      const nextEmployment = futureEmployments[0];
      if (nextEmployment) {
        // Override any provided end date with calculated one from future employment
        entity.employmentEndDate = new Date(
          new Date(nextEmployment.employmentStartDate).getTime() - 1
        );
      }

      results.push(entity);
    }

    // Second pass: perform all updates (deduplicated)

    for (const update of updatesNeeded.values()) {
      try {
        const result = await this.update(update.id, update.data, authUser);
      } catch (error) {
        throw error;
      }
    }

    // Third pass: create all new employments
    const createdEmployments = await this.repository.createMany(results);

    return await Promise.all(
      createdEmployments.map((employment) =>
        this.transformToResponse(employment)
      )
    );
  };

  public create = async (
    data: EmploymentDTO,
    authUser?: AuthenticatedCollaborator
  ): Promise<EmploymentEntity> => {
    const entity = new this.entityClass(data);
    const newEmploymentStartDate = new Date(entity.employmentStartDate);

    // 1. Handle previous employment conflicts
    const previousEmployment = await this.getEmploymentByCollaboratorBeforeDate(
      data.collaboratorId,
      entity.employmentStartDate.toString()
    );

    if (
      previousEmployment &&
      (!previousEmployment.employmentEndDate ||
        new Date(previousEmployment.employmentEndDate) >=
          newEmploymentStartDate)
    ) {
      await this.update(
        previousEmployment.id!,
        {
          ...previousEmployment,
          isActive: false,
          employmentEndDate: new Date(newEmploymentStartDate.getTime() - 1),
        },
        authUser
      );
    }

    // 2. Handle future employment conflicts
    const futureEmployments = await this.getAll({
      filteringDto: {
        collaboratorId: data.collaboratorId,
        employmentStartDate: { $gt: entity.employmentStartDate },
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "asc",
      },
    });

    const nextEmployment = futureEmployments[0];
    if (nextEmployment) {
      // Override any provided end date with calculated one from future employment
      entity.employmentEndDate = new Date(
        new Date(nextEmployment.employmentStartDate).getTime() - 1
      );
    }

    const result = await this.repository.create(entity);

    return this.transformToResponse(result);
  };

  public getEmploymentByCollaboratorAndPeriod = async (
    periodStartDate: string,
    periodEndDate: string
  ) => {
    const employments = await this.getAll({
      filteringDto: {
        employmentStartDate: { $lte: periodEndDate },
        $or: [
          { employmentEndDate: { $exists: false } },
          { employmentEndDate: { $gt: periodStartDate } },
        ],
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "desc",
      },
    });

    return employments[0];
  };

  public getEmploymentByCollaboratorAndDate = async (
    collaboratorId: string,
    date: string
  ) => {
    const employments = await this.getAll({
      filteringDto: {
        collaboratorId,
        employmentStartDate: { $lte: date },
        $or: [
          { employmentEndDate: { $exists: false } },
          { employmentEndDate: null },
          { employmentEndDate: { $gte: date } },
        ],
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "desc",
      },
    });
    return employments[0];
  };

  public getLatestEmploymentByCollaborator = async (
    collaboratorId: string
  ): Promise<EmploymentEntity | null> => {
    const employments = await this.getAll({
      filteringDto: {
        collaboratorId,
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "desc",
      },
    });
    return employments[0] || null;
  };

  public getEmploymentByCollaboratorBeforeDate = async (
    collaboratorId: string,
    beforeDate: string
  ): Promise<EmploymentEntity | null> => {
    const employments = await this.getAll({
      filteringDto: {
        collaboratorId,
        employmentStartDate: { $lt: beforeDate },
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "desc",
      },
    });
    return employments[0] || null;
  };

  public createDraftEmploymentsForActiveCollaborators = async (
    startDate: string,
    endDate?: string
  ): Promise<DraftEmploymentReadModel[]> => {
    const activeCollaborators =
      await this.collaboratorService.getCollaboratorsByDate(startDate);

    // Get salary data once for all collaborators (same year)
    const startYear = dayjs(startDate).year();
    const minimumWage = await this.getMinimumWageForYear(startYear);

    const draftEmployments: DraftEmploymentReadModel[] = [];

    for (const collaborator of activeCollaborators) {
      // Get the employment that was active before the start date
      const previousEmployment =
        await this.getEmploymentByCollaboratorBeforeDate(
          collaborator.id!,
          startDate
        );

      const draftEmployment = await this.calculateDraftEmployment(
        collaborator,
        startDate,
        endDate,
        minimumWage,
        previousEmployment
      );

      draftEmployments.push({
        simplifiedCollaborator: {
          id: collaborator.id!,
          col_code: collaborator.col_code,
        },
        prevEmployment: previousEmployment,
        newEmployment: draftEmployment,
      });
    }

    return draftEmployments;
  };

  public createDraftEmploymentForCollaborator = async (
    collaboratorId: string,
    startDate: string,
    endDate?: string
  ): Promise<DraftEmploymentReadModel> => {
    if (!this.collaboratorService) {
      throw new Error("Collaborator service not available");
    }

    // Get the collaborator
    const collaborator = await this.collaboratorService.getById(collaboratorId);
    if (!collaborator) {
      throw new Error(`Collaborator with id ${collaboratorId} not found`);
    }

    // Get salary data for the year
    const startYear = dayjs(startDate).year();
    const minimumWage = await this.getMinimumWageForYear(startYear);

    // Get the employment that was active before the start date
    const previousEmployment = await this.getEmploymentByCollaboratorBeforeDate(
      collaborator.id!,
      startDate
    );

    const newEmployment = await this.calculateDraftEmployment(
      collaborator,
      startDate,
      endDate,
      minimumWage,
      previousEmployment
    );

    return {
      simplifiedCollaborator: {
        id: collaborator.id!,
        col_code: collaborator.col_code,
      },
      prevEmployment: previousEmployment,
      newEmployment: newEmployment,
    };
  };

  private calculateDraftEmployment = async (
    collaborator: any,
    startDate: string,
    endDate?: string,
    minimumWage: number = 278.8,
    previousEmployment?: EmploymentEntity | null
  ): Promise<EmploymentEntity> => {
    // Get job information
    const jobId = previousEmployment?.jobId || collaborator.jobId || "";
    const job =
      jobId && this.jobService ? await this.jobService.getById(jobId) : null;

    // Calculate basic work metrics
    const weeklyHours =
      previousEmployment?.weeklyHours || collaborator.weeklyHours || 48;
    const dailyWorkingHours = weeklyHours / WORKING_DAYS_IN_A_WEEK;
    const workWeekRatio = weeklyHours / MAX_WORK_WEEK_LIMIT;

    // Calculate seniority bonus percentage (completed years worked * annual raise percent)
    const collaboratorStartDate = collaborator.startDate
      ? dayjs(collaborator.startDate)
      : dayjs();

    const employmentStartDate = dayjs(startDate);

    const completedYearsWorked = employmentStartDate.diff(
      collaboratorStartDate,
      "year"
    );
    const seniorityBonusPercentage = Math.max(
      0,
      completedYearsWorked * ANNUAL_RAISE_PERCENT
    );

    // Calculate commission bonus percentage (completed semesters worked * commission seniority bonus per semester)
    const completedSemestersWorked = Math.floor(
      employmentStartDate.diff(collaboratorStartDate, "month") / 6
    );

    const commissionBonusPercentage =
      completedSemestersWorked * COMMISSION_SENIORITY_BONUS_PER_SEMESTER;

    // Calculate employment guaranteed income (job guaranteed income * work week ratio)
    const employmentGuaranteedIncome = job?.guaranteedJobIncome
      ? 0
      : previousEmployment?.employmentGuaranteedIncome || 0;

    // Calculate employment fixed income by job (job fixed income * work week ratio * (1 + seniority bonus))
    const employmentFixedIncomeByJob = job?.jobFixedIncome
      ? job.jobFixedIncome * workWeekRatio * (1 + seniorityBonusPercentage)
      : previousEmployment?.employmentFixedIncomeByJob || 0;

    // Get additional role and complementary fixed income from previous employment
    const additionalRoleFixedIncome =
      previousEmployment?.additionalRoleFixedIncome || 0;
    const complementaryFixedIncome =
      previousEmployment?.complementaryFixedIncome || 0;

    // Calculate employment degree bonus
    const employmentDegreeBonus =
      DEGREE_BONUS[collaborator.degree as Degree] || 0 * workWeekRatio;

    // Calculate total fixed income
    const totalFixedIncome =
      employmentFixedIncomeByJob +
      additionalRoleFixedIncome +
      complementaryFixedIncome +
      employmentDegreeBonus;

    // Calculate derived income metrics
    const nominalDailyFixedIncome = totalFixedIncome / 30;
    const nominalHourlyFixedIncome =
      nominalDailyFixedIncome / dailyWorkingHours;

    // Effective daily income (at least minimum wage)
    const effectiveDailyFixedIncome = Math.max(
      totalFixedIncome / AVERAGE_WORK_DAYS_PER_MONTH,
      minimumWage
    );
    const effectiveHourlyFixedIncome =
      effectiveDailyFixedIncome / dailyWorkingHours;

    // Employment hourly rate (uses the original effective calculation)
    const employmentHourlyRate =
      totalFixedIncome / AVERAGE_WORK_DAYS_PER_MONTH / dailyWorkingHours;

    // Get average commissions per scheduled hour
    let averageCommissionsPerScheduledHour = 10; // Default fallback

    if (this.commissionService) {
      try {
        const commissionData =
          await this.commissionService.getCollaboratorHourlyCommissionAverage(
            collaborator.id!,
            startDate
          );
        averageCommissionsPerScheduledHour =
          commissionData.hourlyCommissionAverage || 10;
      } catch (error) {
        // Use default value if commission data not available
        averageCommissionsPerScheduledHour = 10;
      }
    }

    // Calculate average ordinary income per scheduled hour
    // TODO: This should take payroll data, but it's not available now
    // For now, calculate from guaranteed income
    const averageOrdinaryIncomePerScheduledHour =
      employmentGuaranteedIncome / 30 / dailyWorkingHours;

    // contribution base salary

    const yearVacationDays =
      calculateVacationsForYearAfter2022(completedYearsWorked);

    let contributionBaseSalaryMain = employmentGuaranteedIncome / 30;
    let contributionBaseSalaryYearBonus =
      (contributionBaseSalaryMain * 15) / 365;
    let contributionBaseSalaryVacationBonus =
      (contributionBaseSalaryMain *
        yearVacationDays *
        VACATION_BONUS_PERCENTAGE) /
      365;

    let contributionBaseSalaryTotal =
      contributionBaseSalaryMain +
      contributionBaseSalaryYearBonus +
      contributionBaseSalaryVacationBonus;

    // Create a draft employment based on the calculated values
    return new EmploymentEntity({
      collaboratorId: collaborator.id!,
      jobId: jobId,
      employmentStartDate: startDate,
      employmentEndDate: endDate || undefined,
      isActive: true,
      paymentType: previousEmployment?.paymentType || HRPaymentType.SALARY,
      attendanceSource:
        previousEmployment?.attendanceSource ||
        HRAttendanceSource.ATTENDANCE_RECORDS,
      weeklyHours: weeklyHours,
      dailyWorkingHours: dailyWorkingHours,
      workWeekRatio: workWeekRatio,
      seniorityBonusPercentage: seniorityBonusPercentage,
      commissionBonusPercentage: commissionBonusPercentage,
      employmentGuaranteedIncome: employmentGuaranteedIncome,
      employmentFixedIncomeByJob: employmentFixedIncomeByJob,
      additionalRoleFixedIncome: additionalRoleFixedIncome,
      complementaryFixedIncome: complementaryFixedIncome,
      employmentDegreeBonus: employmentDegreeBonus,
      employmentHourlyRate: employmentHourlyRate,
      totalFixedIncome: totalFixedIncome,
      nominalDailyFixedIncome: nominalDailyFixedIncome,
      nominalHourlyFixedIncome: nominalHourlyFixedIncome,
      effectiveDailyFixedIncome: effectiveDailyFixedIncome,
      effectiveHourlyFixedIncome: effectiveHourlyFixedIncome,
      averageCommissionsPerScheduledHour: averageCommissionsPerScheduledHour,
      averageOrdinaryIncomePerScheduledHour:
        averageOrdinaryIncomePerScheduledHour,
      trainingSupport: previousEmployment?.trainingSupport || 0,
      physicalActivitySupport: previousEmployment?.physicalActivitySupport || 0,
      contributionBaseSalary: contributionBaseSalaryTotal,
      extraCompensations: previousEmployment?.extraCompensations || [],
      otherDeductions: previousEmployment?.otherDeductions || [],
    });
  };

  private getMinimumWageForYear = async (year: number): Promise<number> => {
    const defaultMinimumWage = 278.8;
    if (!this.salaryDataService) {
      return defaultMinimumWage;
    }

    try {
      const salaryDataResponse = await this.salaryDataService.getAll({
        filteringDto: { year },
      });
      const salaryData = salaryDataResponse[0];
      return salaryData?.minimumWage ?? defaultMinimumWage;
    } catch (error) {
      return defaultMinimumWage;
    }
  };
}
