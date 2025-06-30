import {
  EmploymentEntity,
  PayrollEntity,
  SalaryDataEntity,
} from "../../domain/entities";
import { BaseService } from "./base.service";
import {
  ConcludedWeekHours,
  HRPaymentType,
  PayrollStatus,
  isrRate,
  PayrollRepository,
} from "../../domain";
import { PayrollDTO } from "../dtos";
import {
  PayrollCollaboratorRawData,
  PayrollEstimate,
} from "../../domain/read-models/payroll-estimate.rm";

// Internal calculation types removed - using contextData instead
import {
  BaseError,
  CustomQueryOptions,
  DAILY_WORK_HOURS,
  VACATION_BONUS_PERCENTAGE,
  WEEK_WORK_DAYS,
  WEEKS_IN_MONTH,
} from "../../shared";
import {
  createAttendanceReportService,
  createCollaboratorService,
  createEmploymentService,
  createJobService,
  createSalaryDataService,
} from "../factories";
import { createCommissionAllocationService } from "../factories/commission-allocation.factory";

import {
  DAILY_MEAL_COMPENSATION,
  HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE,
  JUSTIFIED_ABSENCES_PERCENTAGE,
  SUNDAY_BONUS_PERCENTAGE,
} from "../../shared/constants/hris.constants";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

export class PayrollService extends BaseService<PayrollEntity, PayrollDTO> {
  attendanceReportService = createAttendanceReportService();
  employmentService = createEmploymentService();
  jobService = createJobService();
  collaboratorService = createCollaboratorService();
  salaryDataService = createSalaryDataService();
  commissionAllocationService = createCommissionAllocationService();
  constructor(protected readonly repository: PayrollRepository) {
    super(repository, PayrollEntity);
  }

  public getPayrollEstimates = async (
    queryOptions: CustomQueryOptions
  ): Promise<PayrollEstimate[]> => {
    const { periodStartDate, periodEndDate } = queryOptions?.filteringDto ?? {};
    if (!periodStartDate || !periodEndDate) {
      throw BaseError.badRequest(
        `Missing required fields: ${[
          !periodStartDate && "periodStartDate",
          !periodEndDate && "periodEndDate",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }

    // Get shared data that's the same for all collaborators
    const [activeCollaborators, salaryDataResponse] = await Promise.all([
      this.collaboratorService.getCollaboratorsByDate(periodEndDate),
      this.salaryDataService.getAll({
        filteringDto: { year: new Date(periodEndDate).getFullYear() },
      }),
    ]);

    const salaryData = salaryDataResponse[0];
    if (!salaryData) {
      throw BaseError.notFound("Salary data not found");
    }

    // Process collaborators in batches to avoid overwhelming the database
    const batchSize = 5; // Process 5 at a time to avoid DB overload
    const payrollEstimates: PayrollEstimate[] = [];

    for (let i = 0; i < activeCollaborators.length; i += batchSize) {
      const batch = activeCollaborators.slice(i, i + batchSize);

      const batchPromises = batch.map(async (collaborator) => {
        return await this.generatePayrollEstimate(
          collaborator.id!,
          periodStartDate,
          periodEndDate,
          salaryData
        );
      });

      const batchResults = await Promise.all(batchPromises);
      payrollEstimates.push(...batchResults);
    }

    return payrollEstimates;
  };

  public getPayrollEstimateByCollaboratorId = async (
    collaboratorId: string,
    queryOptions: CustomQueryOptions
  ): Promise<PayrollEstimate> => {
    const { periodStartDate, periodEndDate } = queryOptions?.filteringDto ?? {};
    if (!periodStartDate || !periodEndDate) {
      throw BaseError.badRequest(
        `Missing required fields: ${[
          !periodStartDate && "periodStartDate",
          !periodEndDate && "periodEndDate",
        ]
          .filter(Boolean)
          .join(", ")}`
      );
    }

    const salaryDataResponse = await this.salaryDataService.getAll({
      filteringDto: { year: new Date(periodEndDate).getFullYear() },
    });

    const salaryData = salaryDataResponse[0];
    if (!salaryData) {
      throw BaseError.notFound("Salary data not found");
    }

    const payrollEstimate = await this.generatePayrollEstimate(
      collaboratorId,
      periodStartDate,
      periodEndDate,
      salaryData
    );

    return payrollEstimate;
  };

  public getResourceName(): string {
    return "payroll";
  }

  private async generatePayrollEstimate(
    collaboratorId: string,
    periodStartDate: string,
    periodEndDate: string,
    salaryData: SalaryDataEntity
  ) {
    const rawData = await this.getRawData(
      collaboratorId,
      periodStartDate,
      periodEndDate,
      salaryData
    );

    const payroll = this.calculatePayroll(
      rawData,
      periodStartDate,
      periodEndDate
    );

    return payroll;
  }

  private async getRawData(
    collaboratorId: string,
    periodStartDate: string,
    periodEndDate: string,
    salaryData: SalaryDataEntity
  ): Promise<PayrollCollaboratorRawData> {
    const collaboratorPromise =
      this.collaboratorService.getCollaboratorWithJobAndEmployment(
        collaboratorId,
        periodEndDate
      );

    const attendancePromise = this.attendanceReportService.getByCollaboratorId(
      collaboratorId,
      {
        filteringDto: { periodStartDate, periodEndDate },
      }
    );

    const commissionsPromise =
      this.commissionAllocationService.getCollaboratorTotalCommissions(
        collaboratorId,
        {
          filteringDto: {
            date: { $gte: periodStartDate, $lte: periodEndDate },
            period: "half-month",
          },
        }
      );

    const [
      collaboratorWithJobAndEmployment,
      attendanceReport,
      totalCommissions,
    ] = await Promise.all([
      collaboratorPromise,
      attendancePromise,
      commissionsPromise,
    ]);

    if (!collaboratorWithJobAndEmployment) {
      throw BaseError.notFound("Collaborator not found");
    }
    if (!collaboratorWithJobAndEmployment.employment) {
      throw BaseError.notFound("Employment not found");
    }
    if (!collaboratorWithJobAndEmployment.job) {
      throw BaseError.notFound("Job not found");
    }
    if (!attendanceReport) {
      throw BaseError.notFound("Attendance report not found");
    }

    return {
      collaborator: collaboratorWithJobAndEmployment.collaborator,
      employment: collaboratorWithJobAndEmployment.employment,
      job: collaboratorWithJobAndEmployment.job,
      attendanceReport,
      salaryData,
      totalCommissions,
    };
  }

  private calculatePayroll(
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string
  ): PayrollEstimate {
    const payrollEstimate = this.generateEmptyPayrollEstimate();

    // Step 1: Fill payroll general data
    this.fillGeneralData(
      payrollEstimate,
      rawData,
      periodStartDate,
      periodEndDate
    );

    // Check if this is an hourly employee
    const isHourlyEmployee =
      rawData.employment.paymentType === HRPaymentType.HOURLY;

    if (isHourlyEmployee) {
      // Use hourly calculation logic
      this.calculateHourlyPayroll(
        payrollEstimate,
        rawData,
        periodStartDate,
        periodEndDate
      );
    } else {
      // Use original salary calculation logic
      this.calculateSalaryPayroll(
        payrollEstimate,
        rawData,
        periodStartDate,
        periodEndDate
      );
    }

    // Round all numbers to 2 decimal places before returning
    return this.roundPayrollEstimateNumbers(payrollEstimate);
  }

  private calculateSalaryPayroll(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string
  ): void {
    // Step 2: Fill basic variables to the context
    this.fillBasicVariables(
      payrollEstimate,
      rawData,
      periodStartDate,
      periodEndDate
    );

    // Step 3: Fill attendance related discounts and attendance factor to the context
    this.fillAttendanceDiscounts(payrollEstimate, rawData);

    // Step 4: Fill all the earnings that don't depend on other earnings
    this.fillInitialEarnings(payrollEstimate, rawData);

    // Step 5: Fill guaranteed perception compensation
    this.fillGuaranteedPerceptionCompensation(payrollEstimate, rawData);

    // Step 6: Fill employment subsidy
    this.fillEmploymentSubsidy(payrollEstimate, rawData);

    // Step 7: Fill social security withholding
    this.fillSocialSecurityWithholding(payrollEstimate, rawData);

    // Step 8: Fill income tax withholding
    this.fillIncomeTaxWithholding(payrollEstimate, rawData);

    // Step 9: Fill totals
    this.fillTotals(payrollEstimate);
  }

  private calculateHourlyPayroll(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string
  ): void {
    // Step 2: Fill basic variables for hourly employees
    this.fillBasicVariablesHourly(
      payrollEstimate,
      rawData,
      periodStartDate,
      periodEndDate
    );

    // Step 3: Fill hourly earnings (no attendance discounts for hourly)
    this.fillHourlyEarnings(payrollEstimate, rawData);

    // Step 4: Fill totals (no deductions for hourly employees)
    this.fillTotals(payrollEstimate);
  }

  private fillBasicVariablesHourly(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string
  ): void {
    const { attendanceReport } = rawData;
    const periodDaysLength =
      dayjs(periodEndDate)
        .tz("America/Mexico_City")
        .diff(dayjs(periodStartDate).tz("America/Mexico_City"), "day") + 1;

    // For hourly employees, we don't pre-calculate halfWeekFixedIncome here
    // It will be calculated based on actual worked hours
    payrollEstimate.contextData.periodDaysLength = periodDaysLength;
    payrollEstimate.contextData.halfWeekFixedIncome = 0; // Will be calculated in earnings
    payrollEstimate.contextData.workedHours =
      attendanceReport.periodHours.workedHours +
      attendanceReport.periodHours.vacationHours;
  }

  private fillHourlyEarnings(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): void {
    const { employment, job, totalCommissions, attendanceReport } = rawData;
    const { periodHours } = attendanceReport;
    const {
      nominalHourlyFixedIncome,
      trainingSupport,
      physicalActivitySupport,
      averageCommissionsPerScheduledHour,
      employmentHourlyRate,
    } = employment;

    // Calculate halfWeekFixedIncome based on worked hours * hourly rate
    payrollEstimate.earnings.halfWeekFixedIncome =
      periodHours.workedHours * employmentHourlyRate;
    payrollEstimate.contextData.halfWeekFixedIncome =
      payrollEstimate.earnings.halfWeekFixedIncome;

    // Set commissions (same calculation)
    payrollEstimate.earnings.commissions = totalCommissions;

    // Vacation compensation (same calculation)
    payrollEstimate.earnings.vacationCompensation =
      periodHours.vacationHours * averageCommissionsPerScheduledHour;

    // Express branch compensation (same calculation)
    payrollEstimate.earnings.expressBranchCompensation =
      periodHours.expressHours *
      (job.expressBranchCompensation / DAILY_WORK_HOURS);

    // Meal compensation (same calculation)
    payrollEstimate.earnings.mealCompensation =
      periodHours.mealDays * DAILY_MEAL_COMPENSATION;

    // Reception bonus (same calculation - currently 0)
    payrollEstimate.earnings.receptionBonus = 0;

    // Sunday bonus (same calculation)
    payrollEstimate.earnings.sundayBonus =
      periodHours.workedSundayHours *
      nominalHourlyFixedIncome *
      SUNDAY_BONUS_PERCENTAGE;

    // Holiday/rest extra pay (same calculation)
    const holidayOrRestHours = periodHours.publicHolidaysHours;
    payrollEstimate.earnings.holidayOrRestExtraPay =
      holidayOrRestHours *
      nominalHourlyFixedIncome *
      HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE;

    // Support payments (same calculation)
    payrollEstimate.earnings.traniningActivitySupport = trainingSupport / 2;
    payrollEstimate.earnings.physicalActivitySupport =
      physicalActivitySupport / 2;

    // Vacation bonus (same calculation)
    const vacationDays =
      periodHours.vacationHours / employment.dailyWorkingHours;
    const averageOrdinaryIncomeDaily =
      employment.averageOrdinaryIncomePerScheduledHour *
      employment.dailyWorkingHours;
    payrollEstimate.earnings.vacationBonus =
      vacationDays * averageOrdinaryIncomeDaily * VACATION_BONUS_PERCENTAGE;

    // End year bonus (same calculation - currently 0)
    payrollEstimate.earnings.endYearBonus = 0;

    // Extra compensations (same calculation)
    payrollEstimate.earnings.extraFixedCompensations =
      employment.extraCompensations.map((compensation) => ({
        name: compensation.name,
        description: compensation.name,
        amount: compensation.amount / 2, // Half month
      }));

    payrollEstimate.earnings.extraVariableCompensations = [];
    payrollEstimate.earnings.specialBonuses = [];

    // Set all deductions to 0 for hourly employees
    payrollEstimate.deductions.incomeTaxWithholding = 0;
    payrollEstimate.deductions.socialSecurityWithholding = 0;
    payrollEstimate.deductions.nonCountedDaysDiscount = 0;
    payrollEstimate.deductions.justifiedAbsencesDiscount = 0;
    payrollEstimate.deductions.unjustifiedAbsencesDiscount = 0;
    payrollEstimate.deductions.unworkedHoursDiscount = 0;
    payrollEstimate.deductions.tardinessDiscount = 0;

    // Keep other fixed deductions (same calculation)
    payrollEstimate.deductions.otherFixedDeductions =
      employment.otherDeductions.map((deduction) => ({
        name: deduction.name,
        description: deduction.name,
        amount: deduction.amount / 2, // Half month
      }));

    payrollEstimate.deductions.otherVariableDeductions = [];
  }

  private fillGeneralData(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string
  ): void {
    const { collaborator, employment, job } = rawData;

    payrollEstimate.collaboratorId = collaborator.id!;
    payrollEstimate.periodStartDate = new Date(periodStartDate);
    payrollEstimate.periodEndDate = new Date(periodEndDate);
    payrollEstimate.generalData = {
      fullName: `${collaborator.first_name} ${collaborator.last_name}`,
      collaboratorCode: collaborator.col_code,
      curp: collaborator.curp ?? "",
      socialSecurityNumber: collaborator?.imssNumber || "",
      rfcNumber: collaborator?.rfcCode || "",
      jobTitle: job.title,
      paymentType: employment.paymentType,
      contributionBaseSalary: employment.contributionBaseSalary,
    };
  }

  private fillBasicVariables(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string
  ): void {
    const { employment, attendanceReport } = rawData;
    const {
      totalFixedIncome,
      dailyWorkingHours,
      averageOrdinaryIncomePerScheduledHour,
    } = employment;

    const periodDaysLength =
      dayjs(periodEndDate)
        .tz("America/Mexico_City")
        .diff(dayjs(periodStartDate).tz("America/Mexico_City"), "day") + 1;

    const halfWeekFixedIncome = totalFixedIncome / 2;

    const averageOrdinaryIncomeDaily =
      averageOrdinaryIncomePerScheduledHour * dailyWorkingHours;

    // Fill context data
    payrollEstimate.contextData.periodDaysLength = periodDaysLength;
    payrollEstimate.contextData.halfWeekFixedIncome = halfWeekFixedIncome;
    payrollEstimate.contextData.averageOrdinaryIncomeDaily =
      averageOrdinaryIncomeDaily;
    payrollEstimate.contextData.workedHours =
      attendanceReport.periodHours.workedHours;
  }

  private fillAttendanceDiscounts(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): void {
    const { employment, attendanceReport } = rawData;
    const { periodHours, concludedWeeksHours, tardiness } = attendanceReport;
    const {
      dailyWorkingHours,
      effectiveHourlyFixedIncome,
      nominalDailyFixedIncome,
    } = employment;
    const {
      justifiedAbsenceByCompanyHours,
      nonComputableHours,
      sickLeaveHours,
      authorizedUnjustifiedAbsenceHours,
      unjustifiedAbsenceHours,
    } = periodHours;
    const { notWorkedHours } = concludedWeeksHours;

    // Get values from context
    const { periodDaysLength, halfWeekFixedIncome } =
      payrollEstimate.contextData;

    // Calculate attendance-related discounts for deductions
    const totalNonComputableHours = nonComputableHours;
    const nonComputableDays = totalNonComputableHours / dailyWorkingHours;
    const nonComputableDaysRatio = nonComputableDays / periodDaysLength;

    const totalUnjustifiedAbsenceHours =
      unjustifiedAbsenceHours + authorizedUnjustifiedAbsenceHours;

    const totalJustifiedAbsenceHours =
      sickLeaveHours + justifiedAbsenceByCompanyHours;

    // discounts
    const nonComputableDiscount = nonComputableDaysRatio * halfWeekFixedIncome;
    const unjustifiedAbsenceDiscount =
      totalUnjustifiedAbsenceHours * effectiveHourlyFixedIncome;
    const justifiedAbsenceDiscount =
      totalJustifiedAbsenceHours * effectiveHourlyFixedIncome;
    const notWorkedDiscount = notWorkedHours * effectiveHourlyFixedIncome;
    const tardinessDiscount =
      Math.floor(tardiness / 3) * nominalDailyFixedIncome;

    const totalAttendanceDiscounts =
      nonComputableDiscount +
      unjustifiedAbsenceDiscount +
      justifiedAbsenceDiscount +
      notWorkedDiscount +
      tardinessDiscount;

    // Calculate attendance factor
    const attendanceFactor = Math.max(
      0,
      Math.min(
        1,
        (halfWeekFixedIncome - totalAttendanceDiscounts) / halfWeekFixedIncome
      )
    );

    // Fill attendance factor and discounts in context
    payrollEstimate.contextData.attendanceFactor = attendanceFactor;
    payrollEstimate.contextData.attendanceRelatedDiscounts =
      totalAttendanceDiscounts;

    // Fill employment-based deductions (attendance-related)
    payrollEstimate.deductions.nonCountedDaysDiscount = nonComputableDiscount;
    payrollEstimate.deductions.justifiedAbsencesDiscount =
      justifiedAbsenceDiscount;
    payrollEstimate.deductions.unjustifiedAbsencesDiscount =
      unjustifiedAbsenceDiscount;
    payrollEstimate.deductions.unworkedHoursDiscount = notWorkedDiscount;
    payrollEstimate.deductions.tardinessDiscount = tardinessDiscount;

    // Other employment-based deductions
    payrollEstimate.deductions.otherFixedDeductions =
      employment.otherDeductions.map((deduction) => ({
        name: deduction.name,
        description: deduction.name,
        amount: deduction.amount / 2, // Half month
      }));
  }

  private fillInitialEarnings(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): void {
    const { employment, job, totalCommissions, attendanceReport } = rawData;
    const {
      periodHours,
      concludedWeeksHours,
      punctualityBonus: hasPunctualityBonus,
    } = attendanceReport;

    const {
      nominalHourlyFixedIncome,
      nominalDailyFixedIncome,
      averageCommissionsPerScheduledHour,
      dailyWorkingHours,
      trainingSupport,
      physicalActivitySupport,
    } = employment;

    // Get values from context
    const { halfWeekFixedIncome, averageOrdinaryIncomeDaily } =
      payrollEstimate.contextData;

    // Set half week fixed income
    payrollEstimate.earnings.halfWeekFixedIncome = halfWeekFixedIncome;

    // Set commissions
    payrollEstimate.earnings.commissions = totalCommissions;

    // Vacation compensation
    const vacationDays = periodHours.vacationHours / dailyWorkingHours;
    payrollEstimate.earnings.vacationCompensation =
      periodHours.vacationHours * averageCommissionsPerScheduledHour;

    // Other fixed compensations
    payrollEstimate.earnings.expressBranchCompensation =
      periodHours.expressHours *
      (job.expressBranchCompensation / DAILY_WORK_HOURS);

    payrollEstimate.earnings.mealCompensation =
      periodHours.mealDays * DAILY_MEAL_COMPENSATION;

    payrollEstimate.earnings.punctualityBonus = hasPunctualityBonus
      ? nominalDailyFixedIncome
      : 0;

    payrollEstimate.earnings.absencesJustifiedByCompanyCompensation =
      nominalHourlyFixedIncome *
      periodHours.justifiedAbsenceByCompanyHours *
      JUSTIFIED_ABSENCES_PERCENTAGE;

    payrollEstimate.earnings.traniningActivitySupport = trainingSupport / 2;
    payrollEstimate.earnings.physicalActivitySupport =
      physicalActivitySupport / 2;

    // Overtime compensation
    const { simpleOvertimeHours, doubleOvertimeHours, tripleOvertimeHours } =
      this.calculateOvertimeCompensations(concludedWeeksHours, employment);

    payrollEstimate.earnings.simpleOvertimeHours = simpleOvertimeHours;
    payrollEstimate.earnings.doubleOvertimeHours = doubleOvertimeHours;
    payrollEstimate.earnings.tripleOvertimeHours = tripleOvertimeHours;

    // Sunday and holiday/rest bonuses
    payrollEstimate.earnings.sundayBonus =
      periodHours.workedSundayHours *
      nominalHourlyFixedIncome *
      SUNDAY_BONUS_PERCENTAGE;

    const holidayOrRestHours =
      periodHours.publicHolidaysHours + concludedWeeksHours.restWorkedHours;

    payrollEstimate.earnings.holidayOrRestExtraPay =
      holidayOrRestHours *
      nominalHourlyFixedIncome *
      HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE;

    // Bonuses
    const vacationBonus =
      vacationDays * averageOrdinaryIncomeDaily * VACATION_BONUS_PERCENTAGE;

    payrollEstimate.earnings.vacationBonus = vacationBonus;

    // TODO: Placeholders for future calculation logic
    payrollEstimate.earnings.receptionBonus = 0;
    payrollEstimate.earnings.endYearBonus = 0;
    payrollEstimate.earnings.profitSharing = 0;

    payrollEstimate.earnings.extraFixedCompensations =
      employment.extraCompensations.map((compensation) => ({
        name: compensation.name,
        description: compensation.name,
        amount: compensation.amount / 2, // Half month
      }));

    payrollEstimate.earnings.extraVariableCompensations = [];
  }

  private fillGuaranteedPerceptionCompensation(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): void {
    // Get values from context
    const { attendanceFactor, attendanceRelatedDiscounts } =
      payrollEstimate.contextData;

    // Calculate guaranteed perception compensation
    const subTotalOrdinaryIncome =
      payrollEstimate.earnings.halfWeekFixedIncome +
      payrollEstimate.earnings.commissions +
      payrollEstimate.earnings.vacationCompensation +
      payrollEstimate.earnings.absencesJustifiedByCompanyCompensation +
      payrollEstimate.earnings.expressBranchCompensation +
      payrollEstimate.earnings.mealCompensation +
      payrollEstimate.earnings.receptionBonus +
      payrollEstimate.earnings.punctualityBonus +
      payrollEstimate.earnings.specialBonuses.reduce(
        (acc, bonus) => acc + bonus.amount,
        0
      );

    const totalOrdinaryIncome =
      subTotalOrdinaryIncome - attendanceRelatedDiscounts;

    const maxGuaranteedPerception =
      (rawData.employment.employmentGuaranteedIncome / 2) * attendanceFactor;

    payrollEstimate.earnings.guaranteedPerceptionCompensation = Math.max(
      0,
      maxGuaranteedPerception - totalOrdinaryIncome
    );
  }

  private fillEmploymentSubsidy(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): void {
    // Calculate total income without subsidy
    const totalIncomeWithoutSubsidy =
      this.calculateTotalEarnings(payrollEstimate) -
      payrollEstimate.contextData.attendanceRelatedDiscounts;

    const shouldReceiveSubsidy =
      totalIncomeWithoutSubsidy < rawData.salaryData.employmentSubsidyLimit / 2;

    payrollEstimate.earnings.employmentSubsidy = shouldReceiveSubsidy
      ? rawData.salaryData.employmentSubsidyAmount / 2
      : 0;
  }

  private fillSocialSecurityWithholding(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): void {
    const { employerImssRate, employeeImssRate } =
      this.calculateSocialSecurityWithholding(
        rawData.employment.contributionBaseSalary,
        rawData.salaryData
      );

    payrollEstimate.deductions.socialSecurityWithholding = employeeImssRate;
    payrollEstimate.contextData.employerImssRate = employerImssRate;
  }

  private fillIncomeTaxWithholding(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): void {
    // Calculate ISR base with exemptions
    const totalIncome = this.calculateTotalEarnings(payrollEstimate);
    const exemptions = this.calculateTaxExemptions(payrollEstimate, rawData);
    const deductions = this.calculateTotalDeductions(payrollEstimate);
    const isrBase = totalIncome - exemptions - deductions;

    const isr = this.calculateIsr(
      isrBase,
      rawData.salaryData.halfMonthIsrRates
    );
    payrollEstimate.deductions.incomeTaxWithholding = isr;
  }

  private fillTotals(payrollEstimate: PayrollEstimate): void {
    const totalIncome = this.calculateTotalEarnings(payrollEstimate);
    const totalDeductions = this.calculateTotalDeductions(payrollEstimate);

    payrollEstimate.totals.totalIncome = totalIncome;
    payrollEstimate.totals.totalDeductions = totalDeductions;
    payrollEstimate.totals.netPay = totalIncome - totalDeductions;
  }

  private calculateTotalEarnings(payrollEstimate: PayrollEstimate): number {
    return Object.entries(payrollEstimate.earnings)
      .filter(([key, value]) => typeof value === "number")
      .reduce((sum, [key, value]) => sum + (value as number), 0);
  }

  private calculateTotalDeductions(payrollEstimate: PayrollEstimate): number {
    const fixedDeductions =
      payrollEstimate.deductions.incomeTaxWithholding +
      payrollEstimate.deductions.socialSecurityWithholding +
      payrollEstimate.deductions.nonCountedDaysDiscount +
      payrollEstimate.deductions.justifiedAbsencesDiscount +
      payrollEstimate.deductions.unjustifiedAbsencesDiscount +
      payrollEstimate.deductions.unworkedHoursDiscount +
      payrollEstimate.deductions.tardinessDiscount;

    const otherDeductions =
      payrollEstimate.deductions.otherFixedDeductions.reduce(
        (acc, deduction) => acc + deduction.amount,
        0
      );

    return fixedDeductions + otherDeductions;
  }

  private calculateTaxExemptions(
    payrollEstimate: PayrollEstimate,
    rawData: PayrollCollaboratorRawData
  ): number {
    const { uma } = rawData.salaryData;
    const { employment } = rawData;

    // Calculate various exemptions
    const yearEndBonusExemption = Math.min(
      payrollEstimate.earnings.endYearBonus,
      30 * uma
    );
    const profitSharingExemption = payrollEstimate.earnings.profitSharing; // 100% exempt
    const extraHoursExemption = Math.min(
      payrollEstimate.earnings.doubleOvertimeHours * 0.5,
      (5 * uma) / 2
    );

    // Sunday bonus exemption (1 UMA per Sunday worked)
    const workedSundays = Math.floor(
      rawData.attendanceReport.periodHours.workedSundayHours /
        employment.dailyWorkingHours
    );
    const sundayBonusExemption = Math.min(
      payrollEstimate.earnings.sundayBonus,
      workedSundays * uma
    );

    const vacationBonusExemption = Math.min(
      payrollEstimate.earnings.vacationBonus,
      15 * uma
    );

    return (
      yearEndBonusExemption +
      profitSharingExemption +
      extraHoursExemption +
      sundayBonusExemption +
      vacationBonusExemption
    );
  }

  private calculateIsr(isrBase: number, isrRates: isrRate[]) {
    const isrRate = isrRates.find(
      (rate) => isrBase >= rate.lowerLimit && isrBase <= rate.upperLimit
    );
    const lowerLimit = isrRate?.lowerLimit ?? 0;
    const fixedFee = isrRate?.fixedFee ?? 0;
    const rateBase = isrBase - lowerLimit;
    const isr = rateBase * (isrRate?.rate ?? 0);
    const totalIsr = isr + fixedFee;
    return totalIsr;
  }

  private calculateSocialSecurityWithholding(
    contributionBaseSalary: number,
    salaryData: SalaryDataEntity
  ) {
    const { imssEmployeeRates, imssEmployerRates } = salaryData;
    const uma = salaryData.uma;

    // Helper function to calculate rate based on salary and UMA limits
    const calculateOldAgeRate = (
      oldAgeRates: Array<{ umaLimit: number; rate: string | number }>,
      salary: number,
      uma: number
    ) => {
      const salaryInUmas = salary / uma;
      const applicableRate = oldAgeRates.find(
        (rate) => salaryInUmas <= rate.umaLimit
      );
      return applicableRate ? Number(applicableRate.rate) : 0;
    };

    // Calculate Sickness and Maternity
    // Employer
    const fixedFee =
      uma * imssEmployerRates.sicknessAndMaternity.fixedFee.rate * 15; // Fixed fee based on UMA
    const employerSurplus =
      Math.max(0, contributionBaseSalary - 3 * uma) *
      imssEmployerRates.sicknessAndMaternity.surplus.rate *
      15; // Surplus

    const employerCashBenefits =
      contributionBaseSalary *
      imssEmployerRates.sicknessAndMaternity.cashBenefits.rate *
      15; // Cash benefits

    const employerPensionersAndBeneficiaries =
      contributionBaseSalary *
      imssEmployerRates.sicknessAndMaternity.pensionersAndBeneficiaries.rate *
      15; // Pensioners

    const employerDisabilityAndLife =
      contributionBaseSalary *
      imssEmployerRates.disabilityAndLife.disabilityAndLife.rate *
      15; // Disability and Life

    const employerWorkRisk =
      contributionBaseSalary * imssEmployerRates.workRisk.workRisk.rate * 15; // Work Risk

    const employerDaycareAndSocialBenefits =
      contributionBaseSalary *
      imssEmployerRates.daycareAndSocialBenefits.daycareAndSocialBenefits.rate *
      15; // Daycare and Social Benefits

    const employerOldAgeRetirement =
      contributionBaseSalary * imssEmployerRates.oldAge.retirement.rate * 15; // Old Age

    const employerOldAgeRate = calculateOldAgeRate(
      imssEmployerRates.oldAge.oldAge,
      contributionBaseSalary,
      uma
    );
    const employerOldAge = contributionBaseSalary * employerOldAgeRate * 15;
    const employerInfonavit =
      contributionBaseSalary * imssEmployerRates.infonavit.infonavit.rate * 15; // Infonavit

    const employerTotal =
      fixedFee +
      employerSurplus +
      employerCashBenefits +
      employerPensionersAndBeneficiaries +
      employerDisabilityAndLife +
      employerWorkRisk +
      employerDaycareAndSocialBenefits +
      employerOldAgeRetirement +
      employerOldAge +
      employerInfonavit;

    // Employee
    const employeeSurplus =
      Math.max(0, contributionBaseSalary - 3 * uma) *
      imssEmployeeRates.sicknessAndMaternity.surplus.rate *
      15; // Surplus

    const employeeCashBenefits =
      contributionBaseSalary *
      imssEmployeeRates.sicknessAndMaternity.cashBenefits.rate *
      15; // Cash benefits

    const employeePensionersAndBeneficiaries =
      contributionBaseSalary *
      imssEmployeeRates.sicknessAndMaternity.pensionersAndBeneficiaries.rate *
      15; // Pensioners

    const employeeDisabilityAndLife =
      contributionBaseSalary *
      imssEmployeeRates.disabilityAndLife.disabilityAndLife.rate *
      15;

    const employeeOldAgeRate = calculateOldAgeRate(
      imssEmployeeRates.oldAge.oldAge,
      contributionBaseSalary,
      uma
    );

    const employeeOldAge = employeeOldAgeRate * contributionBaseSalary * 15;

    const employeeTotal =
      employeeSurplus +
      employeeCashBenefits +
      employeePensionersAndBeneficiaries +
      employeeDisabilityAndLife +
      employeeOldAge;

    return {
      employerImssRate: Number(employerTotal.toFixed(2)),
      employeeImssRate: Number(employeeTotal.toFixed(2)),
    };
  }

  public calculateFixedAttendance = (rawData: PayrollCollaboratorRawData) => {
    /*
      Get total discounts
      get fixed income
    */
    const { attendanceReport, employment } = rawData;
    const { periodHours, concludedWeeksHours } = attendanceReport;
    const { employmentFixedIncomeByJob: payrollFixedIncome, weeklyHours } =
      employment;
    const {
      justifiedAbsenceByCompanyHours,
      nonComputableHours,
      sickLeaveHours,
      authorizedUnjustifiedAbsenceHours,
      unjustifiedAbsenceHours,
    } = periodHours;

    const { notWorkedHours } = concludedWeeksHours;
    // fixed income

    const totalNonComputableHours = nonComputableHours;
    const totalAbsenceDayHours =
      justifiedAbsenceByCompanyHours +
      unjustifiedAbsenceHours +
      authorizedUnjustifiedAbsenceHours;
    const totalSickLeaveHours = sickLeaveHours;

    const collaboratorDailyWorkHours = weeklyHours / 6;

    const nominalHourlyWage =
      payrollFixedIncome /
      (WEEKS_IN_MONTH * WEEK_WORK_DAYS) /
      collaboratorDailyWorkHours; // for discount days

    const nonComputableDays =
      totalNonComputableHours / collaboratorDailyWorkHours;
    const sickLeaveDays = totalSickLeaveHours / collaboratorDailyWorkHours;
    const absenceDays =
      (totalAbsenceDayHours + notWorkedHours) / collaboratorDailyWorkHours;

    const nonComputableDiscount = totalNonComputableHours * nominalHourlyWage;
    const sickLeaveDiscount = totalSickLeaveHours * nominalHourlyWage;
    const absenceDiscount = totalAbsenceDayHours * nominalHourlyWage;
    const notWorkedDiscount = notWorkedHours * nominalHourlyWage;

    const fixedIncomeDiscounts =
      nonComputableDiscount +
      sickLeaveDiscount +
      absenceDiscount +
      notWorkedDiscount;

    const fixedIncome = Math.max(payrollFixedIncome - fixedIncomeDiscounts, 0);

    return fixedIncome;
  };

  private calculateOvertimeCompensations = (
    concludedWeeksHours: ConcludedWeekHours,
    employment: EmploymentEntity
  ) => {
    const {
      singlePlayWorkedExtraHours,
      doublePlayWorkedExtraHours,
      triplePlayWorkedExtraHours,
    } = concludedWeeksHours;
    const { nominalHourlyFixedIncome } = employment;

    const simpleOvertimeHours =
      singlePlayWorkedExtraHours * nominalHourlyFixedIncome;
    const doubleOvertimeHours =
      doublePlayWorkedExtraHours * nominalHourlyFixedIncome * 2;
    const tripleOvertimeHours =
      triplePlayWorkedExtraHours * nominalHourlyFixedIncome * 3;

    return {
      simpleOvertimeHours,
      doubleOvertimeHours,
      tripleOvertimeHours,
    };
  };

  private generateEmptyPayrollEstimate(): PayrollEstimate {
    return {
      id: undefined,
      collaboratorId: "",
      periodStartDate: new Date(0),
      periodEndDate: new Date(0),
      generalData: {
        fullName: "",
        collaboratorCode: "",
        curp: "",
        socialSecurityNumber: "",
        rfcNumber: "",
        jobTitle: "",
        paymentType: HRPaymentType.SALARY,
        contributionBaseSalary: 0,
      },
      earnings: {
        halfWeekFixedIncome: 0,
        commissions: 0,
        vacationCompensation: 0,
        expressBranchCompensation: 0,
        mealCompensation: 0,
        receptionBonus: 0,
        punctualityBonus: 0,
        absencesJustifiedByCompanyCompensation: 0,
        specialBonuses: [],
        guaranteedPerceptionCompensation: 0,
        simpleOvertimeHours: 0,
        doubleOvertimeHours: 0,
        tripleOvertimeHours: 0,
        sundayBonus: 0,
        holidayOrRestExtraPay: 0,
        traniningActivitySupport: 0,
        physicalActivitySupport: 0,
        extraFixedCompensations: [],
        extraVariableCompensations: [],
        vacationBonus: 0,
        endYearBonus: 0,
        profitSharing: 0,
        employmentSubsidy: 0,
      },
      deductions: {
        incomeTaxWithholding: 0,
        socialSecurityWithholding: 0,
        otherFixedDeductions: [],
        otherVariableDeductions: [],
        nonCountedDaysDiscount: 0,
        justifiedAbsencesDiscount: 0,
        unjustifiedAbsencesDiscount: 0,
        unworkedHoursDiscount: 0,
        tardinessDiscount: 0,
      },
      totals: {
        totalIncome: 0,
        totalDeductions: 0,
        netPay: 0,
      },
      contextData: {
        periodDaysLength: 0,
        halfWeekFixedIncome: 0,
        averageOrdinaryIncomeDaily: 0,
        attendanceRelatedDiscounts: 0,
        attendanceFactor: 0,
        employerImssRate: 0,
        workedHours: 0,
      },
    };
  }

  private roundPayrollEstimateNumbers(
    payrollEstimate: PayrollEstimate
  ): PayrollEstimate {
    // Helper function to round numbers to 2 decimal places
    const roundTo2Decimals = (num: number): number => {
      return Math.round((num + Number.EPSILON) * 100) / 100;
    };

    // Round earnings
    Object.keys(payrollEstimate.earnings).forEach((key) => {
      const value = (payrollEstimate.earnings as any)[key];
      if (typeof value === "number") {
        (payrollEstimate.earnings as any)[key] = roundTo2Decimals(value);
      } else if (Array.isArray(value)) {
        // Handle arrays of objects with amount property
        value.forEach((item) => {
          if (typeof item === "object" && item.amount !== undefined) {
            item.amount = roundTo2Decimals(item.amount);
          }
        });
      }
    });

    // Round deductions
    Object.keys(payrollEstimate.deductions).forEach((key) => {
      const value = (payrollEstimate.deductions as any)[key];
      if (typeof value === "number") {
        (payrollEstimate.deductions as any)[key] = roundTo2Decimals(value);
      } else if (Array.isArray(value)) {
        // Handle arrays of objects with amount property
        value.forEach((item) => {
          if (typeof item === "object" && item.amount !== undefined) {
            item.amount = roundTo2Decimals(item.amount);
          }
        });
      }
    });

    // Round totals
    Object.keys(payrollEstimate.totals).forEach((key) => {
      const value = (payrollEstimate.totals as any)[key];
      if (typeof value === "number") {
        (payrollEstimate.totals as any)[key] = roundTo2Decimals(value);
      }
    });

    // Round contextData
    Object.keys(payrollEstimate.contextData).forEach((key) => {
      const value = (payrollEstimate.contextData as any)[key];
      if (typeof value === "number") {
        (payrollEstimate.contextData as any)[key] = roundTo2Decimals(value);
      }
    });

    // Round contributionBaseSalary in generalData
    if (
      typeof payrollEstimate.generalData.contributionBaseSalary === "number"
    ) {
      payrollEstimate.generalData.contributionBaseSalary = roundTo2Decimals(
        payrollEstimate.generalData.contributionBaseSalary
      );
    }

    return payrollEstimate;
  }
}
