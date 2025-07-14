import { CollaboratorEntity, EmploymentEntity } from "../../domain/entities";
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
  YEAR_END_BONUS_DAYS,
} from "../../shared";

import dayjs from "dayjs";
import {
  createCollaboratorService,
  createCommissionAllocationService,
  createJobService,
  createPayrollService,
  createSalaryDataService,
} from "../factories";

const MX_TIMEZONE = "America/Mexico_City";

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

    activeCollaborators.sort((a, b) => {
      return (a.startDate?.getTime() ?? 0) - (b.startDate?.getTime() ?? 0);
    });

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

  public recalculateEmployment = async (
    employmentData: any
  ): Promise<EmploymentEntity> => {
    if (!this.collaboratorService) {
      throw new Error("Collaborator service not available");
    }

    // Get the collaborator
    const collaborator = await this.collaboratorService.getById(
      employmentData.collaboratorId
    );
    if (!collaborator) {
      throw new Error(
        `Collaborator with id ${employmentData.collaboratorId} not found`
      );
    }

    // Get salary data for the year
    const startYear = dayjs(employmentData.employmentStartDate).year();
    const minimumWage = await this.getMinimumWageForYear(startYear);

    // Use the employment data directly as "previous employment"
    const recalculatedEmployment = await this.calculateDraftEmployment(
      collaborator,
      employmentData.employmentStartDate.toString(),
      employmentData.employmentEndDate?.toString(),
      minimumWage,
      employmentData
    );

    return recalculatedEmployment;
  };

  public recalculateEmployments = async (
    employmentsData: EmploymentDTO[]
  ): Promise<EmploymentEntity[]> => {
    if (!this.collaboratorService) {
      throw new Error("Collaborator service not available");
    }

    if (!Array.isArray(employmentsData)) {
      throw new Error("Employment data must be an array");
    }

    const results: EmploymentEntity[] = [];
    const collaboratorCache = new Map<string, any>();
    const minimumWageCache = new Map<number, number>();

    // Process each employment
    for (const employmentData of employmentsData) {
      try {
        // Get the collaborator (use cache to avoid repeated requests)
        let collaborator = collaboratorCache.get(employmentData.collaboratorId);
        if (!collaborator) {
          collaborator = await this.collaboratorService.getById(
            employmentData.collaboratorId
          );
          if (!collaborator) {
            throw new Error(
              `Collaborator with id ${employmentData.collaboratorId} not found`
            );
          }
          collaboratorCache.set(employmentData.collaboratorId, collaborator);
        }

        // Get salary data for the year (use cache to avoid repeated requests)
        const startYear = dayjs(employmentData.employmentStartDate).year();
        let minimumWage = minimumWageCache.get(startYear);
        if (!minimumWage) {
          minimumWage = await this.getMinimumWageForYear(startYear);
          minimumWageCache.set(startYear, minimumWage);
        }

        // Use the employment data directly as "previous employment"
        const recalculatedEmployment = await this.calculateDraftEmployment(
          collaborator,
          employmentData.employmentStartDate.toString(),
          employmentData.employmentEndDate?.toString(),
          minimumWage,
          employmentData,
          true
        );

        results.push(recalculatedEmployment);
      } catch (error) {
        // Continue processing other employments even if one fails
        console.error(
          `Error recalculating employment for collaborator ${employmentData.collaboratorId}:`,
          error
        );
        // You might want to include the error in the response or handle it differently
        throw error;
      }
    }

    return results;
  };

  public async getEmploymentsByCollaboratorAndPeriod(
    collaboratorId: string,
    periodStartDate: string,
    periodEndDate: string
  ) {
    return await this.getAll({
      filteringDto: {
        collaboratorId,
        employmentStartDate: { $lte: periodEndDate },
        $or: [
          { employmentEndDate: { $exists: false } },
          { employmentEndDate: null },
          { employmentEndDate: { $gte: periodStartDate } },
        ],
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "asc",
      },
    });
  }

  public getCollaboratorHourlyCommissionAverage = async (
    collaboratorId: string,
    newStartingDate: string
  ): Promise<number> => {
    // Calculate end date (last day of the previous month in Mexico)
    const endDate = dayjs
      .tz(newStartingDate, MX_TIMEZONE)
      .subtract(1, "month")
      .endOf("month")
      .endOf("day")
      .toDate();

    // Calculate start date (3 months before endDate, first day of that month)
    const startDate = dayjs
      .tz(endDate, MX_TIMEZONE)
      .subtract(3, "month")
      .startOf("month")
      .startOf("day")
      .toDate();

    // Get all employments for the collaborator in the period

    const employments = await this.getEmploymentsByCollaboratorAndPeriod(
      collaboratorId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    // Get all commissions for the collaborator in the period

    const commissions =
      await this.commissionService.getCommissionsByCollaboratorAndPeriod(
        collaboratorId,
        startDate,
        endDate
      );

    // Calculate total hours worked
    const totalHoursWorked = this.calculateTotalHoursWorked(
      employments,
      startDate,
      endDate
    );

    // Calculate total commissions
    const totalCommissions = commissions.reduce(
      (sum, commission) => sum + commission.commissionAmount,
      0
    );

    // Calculate hourly commission average
    const hourlyCommissionAverage =
      totalHoursWorked > 0 ? totalCommissions / totalHoursWorked : 0;

    return Math.max(hourlyCommissionAverage, 10);
  };

  private calculateDraftEmployment = async (
    collaborator: any,
    startDate: string,
    endDate?: string,
    minimumWage: number = 278.8,
    previousEmployment?: EmploymentEntity | null,
    overrideData: boolean = false
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

    // Calculate employment fixed income by job (job fixed income * work week ratio * (1 + seniority bonus))

    const jobFixedIncome = (job?.jobFixedIncome ?? 0) * workWeekRatio;

    const employmentFixedIncomeByJob =
      jobFixedIncome * (1 + seniorityBonusPercentage);

    const additionalFixedIncomes =
      previousEmployment?.additionalFixedIncomes || [];

    const attendanceFixedIncomesTotal = additionalFixedIncomes.reduce(
      (acc, curr) => acc + (curr.isAttendanceRelated ? curr.amount : 0),
      0
    );

    // Calculate total fixed income
    const totalFixedIncome =
      employmentFixedIncomeByJob + attendanceFixedIncomesTotal;

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

    // Calculate employment guaranteed income

    const employmentGuaranteedIncome =
      (job?.guaranteedJobIncome ?? 0) * workWeekRatio;

    const averageCommissionsPerScheduledHour =
      await this.getCollaboratorHourlyCommissionAverage(
        collaborator.id!,
        startDate
      );

    // ordinary income
    const averageOrdinaryIncomePerScheduledHour =
      await this.getAverageOrdinaryIncomePerScheduledHour(
        collaborator.id!,
        startDate,
        employmentGuaranteedIncome,
        dailyWorkingHours,
        nominalHourlyFixedIncome
      );

    // SBC
    const contributionBaseSalary = overrideData
      ? previousEmployment?.contributionBaseSalary ?? 0
      : (await this.getCollaboratorContributionBaseSalary(
          collaborator,
          startDate,
          minimumWage
        )) ?? 0;

    return new EmploymentEntity({
      collaboratorId: collaborator.id!,
      jobId: jobId,
      employmentStartDate: startDate,
      employmentEndDate: endDate || undefined,
      isActive: endDate ? false : true,
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
      employmentHourlyRate: employmentHourlyRate,
      totalFixedIncome: totalFixedIncome,
      nominalDailyFixedIncome: nominalDailyFixedIncome,
      nominalHourlyFixedIncome: nominalHourlyFixedIncome,
      effectiveDailyFixedIncome: effectiveDailyFixedIncome,
      effectiveHourlyFixedIncome: effectiveHourlyFixedIncome,
      averageCommissionsPerScheduledHour: averageCommissionsPerScheduledHour,
      averageOrdinaryIncomePerScheduledHour,
      trainingSupport: previousEmployment?.trainingSupport || 0,
      physicalActivitySupport: previousEmployment?.physicalActivitySupport || 0,
      contributionBaseSalary,
      otherDeductions: previousEmployment?.otherDeductions || [],
      additionalFixedIncomes: previousEmployment?.additionalFixedIncomes || [],
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

  private getAverageOrdinaryIncomePerScheduledHour = async (
    collaboratorId: string,
    newStartingDate: string,
    employmentGuaranteedIncome: number,
    dailyWorkingHours: number,
    nominalHourlyFixedIncome: number
  ): Promise<number> => {
    // Calculate end date (last day of the previous month in Mexico)
    const endDate = dayjs
      .tz(newStartingDate, MX_TIMEZONE)
      .subtract(1, "month")
      .endOf("month")
      .endOf("day")
      .toDate();

    // Calculate start date (3 months before endDate, first day of that month)
    const startDate = dayjs
      .tz(endDate, MX_TIMEZONE)
      .subtract(3, "month")
      .startOf("month")
      .startOf("day")
      .toDate();

    const employments = await this.getEmploymentsByCollaboratorAndPeriod(
      collaboratorId,
      startDate.toISOString(),
      endDate.toISOString()
    );

    const payrollService = createPayrollService();

    const ordinaryIncome =
      await payrollService.getOrdinaryIncomeByCollaboratorAndPeriod(
        collaboratorId,
        startDate.toISOString(),
        endDate.toISOString()
      );

    const totalHoursWorked = this.calculateTotalHoursWorked(
      employments,
      startDate,
      endDate
    );

    const hourlyOrdinaryIncomeAverage =
      totalHoursWorked > 0 ? ordinaryIncome / totalHoursWorked : 0;

    const baseHourlyIncome =
      employmentGuaranteedIncome / 30 / dailyWorkingHours;
    const minimumHourlyIncome = Math.max(
      baseHourlyIncome,
      nominalHourlyFixedIncome
    );

    const averageOrdinaryIncomePerScheduledHour = Math.max(
      hourlyOrdinaryIncomeAverage,
      minimumHourlyIncome
    );

    return averageOrdinaryIncomePerScheduledHour;
  };

  private calculateTotalHoursWorked(
    employments: EmploymentEntity[],
    periodStartDate: Date,
    periodEndDate: Date
  ): number {
    let totalHours = 0;

    for (const employment of employments) {
      // Determine the actual start and end dates for this employment within the period
      const employmentStart = dayjs.max(
        dayjs(employment.employmentStartDate),
        dayjs(periodStartDate)
      );

      const employmentEnd = employment.employmentEndDate
        ? dayjs.min(dayjs(employment.employmentEndDate), dayjs(periodEndDate))
        : dayjs(periodEndDate);

      // Calculate number of weeks worked
      const weeksWorked = employmentEnd.diff(employmentStart, "week", true);

      // Calculate hours worked for this employment period
      const hoursWorked = weeksWorked * employment.weeklyHours;

      totalHours += Math.max(0, hoursWorked);
    }

    return totalHours;
  }

  private getCollaboratorContributionBaseSalary = async (
    collaboratorId: CollaboratorEntity,
    newStartingDate: string,
    minimumWage: number
  ): Promise<number> => {
    // Calculate end date (last day of the previous month in Mexico)
    const endDate = dayjs
      .tz(newStartingDate, MX_TIMEZONE)
      .subtract(1, "month")
      .endOf("month")
      .endOf("day")
      .toDate();

    // Calculate start date (2 months before endDate to get exactly 3 months period)
    const startDate = dayjs
      .tz(endDate, MX_TIMEZONE)
      .subtract(2, "month")
      .startOf("month")
      .startOf("day")
      .toDate();

    const payrollService = createPayrollService();

    const contributionBaseSalaryBase =
      await payrollService.getContributionBaseSalaryBase(
        collaboratorId.id!,
        startDate.toISOString(),
        endDate.toISOString()
      );

    const contributionBaseSalaryBeforeIntegration = Math.max(
      contributionBaseSalaryBase / 3 / 30,
      minimumWage
    );

    const completedYearsWorked = dayjs(startDate).diff(
      dayjs(collaboratorId.startDate!).toDate(),
      "year"
    );

    const yearVacationDays =
      calculateVacationsForYearAfter2022(completedYearsWorked);

    const vacationBonusCBS =
      (contributionBaseSalaryBeforeIntegration *
        yearVacationDays *
        VACATION_BONUS_PERCENTAGE) /
      365;

    const yearEndBonusCBS =
      (contributionBaseSalaryBeforeIntegration * YEAR_END_BONUS_DAYS) / 365;

    const contributionBaseSalary =
      contributionBaseSalaryBeforeIntegration +
      vacationBonusCBS +
      yearEndBonusCBS;

    return contributionBaseSalary;
  };
}
