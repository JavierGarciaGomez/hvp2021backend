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
  AttendanceDiscounts,
  SimpleSalaryPayrollEarnings,
  FrontendSalaryPayrollEarnings,
  incomeTaxConcepts,
  OtherDeductions,
  PayrollGeneralData,
  PayrollEarnings,
  PayrollDeductions,
  PayrollTotals,
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
import { createCollaboratorHalfWeekClosingReportService } from "../factories/collaborator-half-week-closing-report.factory";

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
  collaboratorHalfWeekClosingReportService =
    createCollaboratorHalfWeekClosingReportService();
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

  public recalculatePayroll = async (
    payrollData: PayrollEstimate
  ): Promise<PayrollEstimate> => {
    const { periodStartDate, periodEndDate, collaboratorId } = payrollData;

    if (!periodStartDate || !periodEndDate || !collaboratorId) {
      throw BaseError.badRequest(
        "Missing required fields: periodStartDate, periodEndDate, or collaboratorId"
      );
    }

    const salaryDataResponse = await this.salaryDataService.getAll({
      filteringDto: { year: periodEndDate.getFullYear() },
    });

    const salaryData = salaryDataResponse[0];
    if (!salaryData) {
      throw BaseError.notFound("Salary data not found");
    }

    const payrollEstimate = await this.generatePayrollEstimate(
      collaboratorId,
      periodStartDate.toISOString().split("T")[0],
      periodEndDate.toISOString().split("T")[0],
      salaryData,
      payrollData
    );

    return payrollEstimate;
  };

  public recalculatePayrollList = async (
    payrollListData: PayrollEstimate[]
  ): Promise<PayrollEstimate[]> => {
    if (!Array.isArray(payrollListData) || payrollListData.length === 0) {
      throw BaseError.badRequest("Invalid payroll list data");
    }

    // Get salary data once for all payrolls (assuming same period)
    const firstPayroll = payrollListData[0];
    const salaryDataResponse = await this.salaryDataService.getAll({
      filteringDto: {
        year: new Date(firstPayroll.periodEndDate).getFullYear(),
      },
    });

    const salaryData = salaryDataResponse[0];
    if (!salaryData) {
      throw BaseError.notFound("Salary data not found");
    }

    // Process payrolls in batches to avoid overwhelming the database
    const batchSize = 5;
    const recalculatedPayrolls: PayrollEstimate[] = [];

    for (let i = 0; i < payrollListData.length; i += batchSize) {
      const batch = payrollListData.slice(i, i + batchSize);

      const batchPromises = batch.map(async (payroll) => {
        const { periodStartDate, periodEndDate, collaboratorId } = payroll;

        if (!periodStartDate || !periodEndDate || !collaboratorId) {
          throw BaseError.badRequest(
            "Missing required fields in payroll data: periodStartDate, periodEndDate, or collaboratorId"
          );
        }

        return await this.generatePayrollEstimate(
          collaboratorId,
          periodStartDate.toISOString().split("T")[0],
          periodEndDate.toISOString().split("T")[0],
          salaryData,
          payroll
        );
      });

      const batchResults = await Promise.all(batchPromises);
      recalculatedPayrolls.push(...batchResults);
    }

    return recalculatedPayrolls;
  };

  public getResourceName(): string {
    return "payroll";
  }

  private async generatePayrollEstimate(
    collaboratorId: string,
    periodStartDate: string,
    periodEndDate: string,
    salaryData: SalaryDataEntity,
    payrollDraft?: PayrollEstimate
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
      periodEndDate,
      payrollDraft
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

    const receptionBonusPromise =
      this.collaboratorHalfWeekClosingReportService.getByCollaboratorAndDateRange(
        collaboratorId,
        new Date(periodStartDate),
        new Date(periodEndDate)
      );

    const [
      collaboratorWithJobAndEmployment,
      attendanceReport,
      totalCommissions,
      receptionBonusReports,
    ] = await Promise.all([
      collaboratorPromise,
      attendancePromise,
      commissionsPromise,
      receptionBonusPromise,
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

    if (collaboratorId === "61e9f7ba11d080f125a93e81") {
      console.log("WAITING FOR REPORT");
    }

    // Calculate total reception bonus from all reports in the period
    const totalReceptionBonus = receptionBonusReports.reduce(
      (total, report) => total + report.totalBonus,
      0
    );

    return {
      collaborator: collaboratorWithJobAndEmployment.collaborator,
      employment: collaboratorWithJobAndEmployment.employment,
      job: collaboratorWithJobAndEmployment.job,
      attendanceReport,
      salaryData,
      totalCommissions,
      totalReceptionBonus,
    };
  }

  private calculatePayroll(
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string,
    payrollDraft?: PayrollEstimate
  ): PayrollEstimate {
    // Step 1: Fill payroll general data

    // Check if this is an hourly employee
    const isHourlyEmployee =
      rawData.employment.paymentType === HRPaymentType.HOURLY;

    let payrollEstimate: PayrollEstimate;

    if (isHourlyEmployee) {
      // Use hourly calculation logic
      payrollEstimate = this.calculateHourlyPayroll(
        rawData,
        periodStartDate,
        periodEndDate
      );
    } else {
      // Use original salary calculation logic
      payrollEstimate = this.calculateSalaryPayroll(
        rawData,
        periodStartDate,
        periodEndDate,
        payrollDraft
      );
    }

    // Round all numbers to 2 decimal places before returning
    return this.roundPayrollEstimateNumbers(payrollEstimate);
  }

  private calculateSalaryPayroll(
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string,
    payrollDraft?: PayrollEstimate
  ): PayrollEstimate {
    const generalData = this.getPayrollGeneralData(rawData);
    // **** common variables ****
    // periodDaysLength

    const periodDaysLength =
      dayjs(periodEndDate)
        .tz("America/Mexico_City")
        .diff(dayjs(periodStartDate).tz("America/Mexico_City"), "day") + 1;

    const totalHalfWeekFixedIncome = rawData.employment.totalFixedIncome / 2;

    // attendance discounts and factor
    const attendanceDiscounts = this.calculateAttendanceDeductions(
      rawData,
      periodDaysLength,
      totalHalfWeekFixedIncome
    );

    const attendanceRelatedDiscounts =
      this.calculateTotalConcepts(attendanceDiscounts);

    const attendanceFactor =
      (totalHalfWeekFixedIncome - attendanceRelatedDiscounts) /
      totalHalfWeekFixedIncome;

    const simplePayrollEarnings = this.calculateSimplePayrollEarnings(
      rawData,
      payrollDraft
    );

    const frontendSalaryPayrollEarnings =
      this.calculateFrontendSalaryPayrollEarnings(payrollDraft);

    const guaranteedIncome = this.calculateGuaranteedIncomeCompensation(
      rawData,
      attendanceFactor,
      simplePayrollEarnings,
      frontendSalaryPayrollEarnings
    );

    const incomeTaxConcepts = this.calculateIncomeTaxConcepts(
      rawData,
      simplePayrollEarnings,
      frontendSalaryPayrollEarnings,
      guaranteedIncome,
      attendanceRelatedDiscounts
    );

    const otherDeductions = this.calculateOtherDeductions(
      rawData,
      attendanceFactor,
      payrollDraft
    );

    const payrollEstimate = this.buildPayrollEstimate({
      periodStartDate,
      periodEndDate,
      generalData,
      attendanceDiscounts,
      attendanceFactor,
      simplePayrollEarnings,
      frontendSalaryPayrollEarnings,
      guaranteedIncome,
      incomeTaxConcepts,
      otherDeductions,
      rawData,
    });
    return payrollEstimate;
  }

  private calculateHourlyPayroll(
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string,
    payrollDraft?: PayrollEstimate
  ): PayrollEstimate {
    const { employment, job, totalCommissions, attendanceReport } = rawData;
    const { employmentHourlyRate } = employment;

    const generalData = this.getPayrollGeneralData(rawData);

    const halfWeekHourlyPay =
      payrollDraft?.earnings?.halfWeekHourlyPay ??
      employmentHourlyRate * attendanceReport.periodHours.workedHours;
    const additionalFixedIncomes = employment.additionalFixedIncomes.map(
      (income) => ({
        name: income.name,
        description: income.name,
        amount: income.amount / 2, // Half month
      })
    );

    const commissions = totalCommissions;
    const receptionBonus = rawData.totalReceptionBonus;
    const expressBranchCompensation =
      attendanceReport.periodHours.expressHours *
      (job.expressBranchCompensation / DAILY_WORK_HOURS);

    const vacationCompensation =
      attendanceReport.periodHours.vacationHours * employmentHourlyRate;

    const specialBonuses = payrollDraft?.earnings?.specialBonuses ?? [];
    const sundayBonus =
      attendanceReport.periodHours.workedSundayHours *
      employmentHourlyRate *
      SUNDAY_BONUS_PERCENTAGE;
    const holidayOrRestExtraPay =
      attendanceReport.periodHours.publicHolidaysHours *
      employmentHourlyRate *
      HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE;
    const endYearBonus = payrollDraft?.earnings?.endYearBonus ?? 0;
    const vacationBonus = vacationCompensation * VACATION_BONUS_PERCENTAGE;

    const traniningActivitySupport = employment.trainingSupport / 2;
    const physicalActivitySupport = employment.physicalActivitySupport / 2;
    const extraVariableCompensations =
      payrollDraft?.earnings?.extraVariableCompensations ?? [];

    const earnings = {
      halfWeekHourlyPay,
      additionalFixedIncomes,
      commissions,
      receptionBonus,
      expressBranchCompensation,
      vacationCompensation,
      specialBonuses,
      sundayBonus,
      holidayOrRestExtraPay,
      endYearBonus,
      vacationBonus,
      traniningActivitySupport,
      physicalActivitySupport,
      extraVariableCompensations,
    };

    const totalIncome = this.calculateTotalConcepts(earnings);

    return {
      collaboratorId: rawData.collaborator.id!,
      periodStartDate: new Date(periodStartDate),
      periodEndDate: new Date(periodEndDate),
      generalData,
      earnings,
      deductions: {},
      totals: {
        totalIncome: totalIncome,
        totalDeductions: 0,
        netPay: totalIncome,
      },
      contextData: {
        attendanceFactor: 0,
        employerImssRate: 0,
        workedHours: attendanceReport.periodHours.workedHours,
      },
    };
  }

  private getPayrollGeneralData(
    rawData: PayrollCollaboratorRawData
  ): PayrollGeneralData {
    const { collaborator, employment, job } = rawData;
    return {
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

  private calculateAttendanceDeductions(
    rawData: PayrollCollaboratorRawData,
    periodDaysLength: number,
    totalHalfWeekFixedIncome: number
  ): AttendanceDiscounts {
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

    // Calculate attendance-related discounts for deductions
    const totalNonComputableHours = nonComputableHours;
    const nonComputableDays = totalNonComputableHours / dailyWorkingHours;
    const nonComputableDaysRatio = nonComputableDays / periodDaysLength;

    const totalUnjustifiedAbsenceHours =
      unjustifiedAbsenceHours + authorizedUnjustifiedAbsenceHours;

    const totalJustifiedAbsenceHours =
      sickLeaveHours + justifiedAbsenceByCompanyHours;

    // discounts
    const nonCountedDaysDiscount =
      nonComputableDaysRatio * totalHalfWeekFixedIncome;
    const unjustifiedAbsencesDiscount =
      totalUnjustifiedAbsenceHours * effectiveHourlyFixedIncome;
    const justifiedAbsencesDiscount =
      totalJustifiedAbsenceHours * effectiveHourlyFixedIncome;
    const unworkedHoursDiscount = notWorkedHours * effectiveHourlyFixedIncome;
    const tardinessDiscount =
      Math.floor(tardiness / 3) * nominalDailyFixedIncome;

    const totalAttendanceDiscounts =
      nonCountedDaysDiscount +
      unjustifiedAbsencesDiscount +
      justifiedAbsencesDiscount +
      unworkedHoursDiscount +
      tardinessDiscount;

    return {
      nonCountedDaysDiscount,
      justifiedAbsencesDiscount,
      unjustifiedAbsencesDiscount,
      unworkedHoursDiscount,
      tardinessDiscount,
    };
  }

  private calculateSimplePayrollEarnings(
    rawData: PayrollCollaboratorRawData,
    payrollDraft?: PayrollEstimate
  ): SimpleSalaryPayrollEarnings {
    const {
      employment,
      attendanceReport,
      job,
      totalCommissions,
      totalReceptionBonus,
    } = rawData;
    const halfWeekFixedIncome =
      payrollDraft?.earnings?.halfWeekFixedIncome ??
      employment.employmentFixedIncomeByJob / 2;
    const additionalFixedIncomes = employment.additionalFixedIncomes.map(
      (income) => ({
        name: income.name,
        description: income.name,
        amount: income.amount / 2, // Half month
      })
    );
    const commissions = totalCommissions;
    const receptionBonus = totalReceptionBonus;
    const punctualityBonus = attendanceReport.punctualityBonus
      ? employment.nominalDailyFixedIncome
      : 0;
    const expressBranchCompensation =
      attendanceReport.periodHours.expressHours *
      (job.expressBranchCompensation / DAILY_WORK_HOURS);
    const vacationCompensation =
      attendanceReport.periodHours.vacationHours *
      employment.averageCommissionsPerScheduledHour;
    const { simpleOvertimeHours, doubleOvertimeHours, tripleOvertimeHours } =
      this.calculateOvertimeCompensations(
        attendanceReport.concludedWeeksHours,
        employment
      );
    const sundayBonus =
      attendanceReport.periodHours.workedSundayHours *
      employment.nominalHourlyFixedIncome *
      SUNDAY_BONUS_PERCENTAGE;

    const holidayOrRestHours =
      attendanceReport.periodHours.publicHolidaysHours +
      attendanceReport.concludedWeeksHours.restWorkedHours;

    const holidayOrRestExtraPay =
      holidayOrRestHours *
      employment.nominalHourlyFixedIncome *
      HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE;

    const vacationBonus =
      attendanceReport.periodHours.vacationHours *
      employment.averageOrdinaryIncomePerScheduledHour *
      VACATION_BONUS_PERCENTAGE;

    const traniningActivitySupport = employment.trainingSupport / 2;
    const physicalActivitySupport = employment.physicalActivitySupport / 2;

    return {
      halfWeekFixedIncome,
      additionalFixedIncomes,
      commissions,
      punctualityBonus,
      receptionBonus,
      expressBranchCompensation,
      vacationCompensation,
      simpleOvertimeHours,
      doubleOvertimeHours,
      tripleOvertimeHours,
      sundayBonus,
      holidayOrRestExtraPay,
      vacationBonus,
      traniningActivitySupport,
      physicalActivitySupport,
    };
  }

  private calculateFrontendSalaryPayrollEarnings(
    payrollDraft?: PayrollEstimate
  ): FrontendSalaryPayrollEarnings {
    const { specialBonuses, endYearBonus, extraVariableCompensations } =
      payrollDraft?.earnings ?? {};

    return {
      specialBonuses: specialBonuses ?? [],
      endYearBonus: endYearBonus ?? 0,
      extraVariableCompensations: extraVariableCompensations ?? [],
      profitSharing: 0,
    };
  }

  private calculateGuaranteedIncomeCompensation(
    rawData: PayrollCollaboratorRawData,
    attendanceFactor: number,
    simplePayrollEarnings: SimpleSalaryPayrollEarnings,
    frontendSalaryPayrollEarnings: FrontendSalaryPayrollEarnings
  ): number {
    const subTotalOrdinaryIncome =
      simplePayrollEarnings.halfWeekFixedIncome +
      simplePayrollEarnings.additionalFixedIncomes.reduce(
        (acc, income) => acc + income.amount,
        0
      ) +
      simplePayrollEarnings.commissions +
      simplePayrollEarnings.receptionBonus +
      simplePayrollEarnings.punctualityBonus +
      simplePayrollEarnings.expressBranchCompensation +
      simplePayrollEarnings.vacationCompensation +
      frontendSalaryPayrollEarnings.specialBonuses.reduce(
        (acc, bonus) => acc + bonus.amount,
        0
      );

    const maxGuaranteedIncome =
      (rawData.employment.employmentGuaranteedIncome / 2) * attendanceFactor;

    const guaranteedIncomeCompensation = Math.max(
      0,
      maxGuaranteedIncome - subTotalOrdinaryIncome
    );

    return guaranteedIncomeCompensation;
  }

  private calculateIncomeTaxConcepts(
    rawData: PayrollCollaboratorRawData,
    simplePayrollEarnings: SimpleSalaryPayrollEarnings,
    frontendSalaryPayrollEarnings: FrontendSalaryPayrollEarnings,
    guaranteedIncome: number,
    attendanceDiscounts: number
  ): incomeTaxConcepts {
    const isrBaseComplete =
      simplePayrollEarnings.halfWeekFixedIncome +
      simplePayrollEarnings.additionalFixedIncomes.reduce(
        (acc, income) => acc + income.amount,
        0
      ) +
      simplePayrollEarnings.commissions +
      simplePayrollEarnings.receptionBonus +
      simplePayrollEarnings.punctualityBonus +
      simplePayrollEarnings.expressBranchCompensation +
      simplePayrollEarnings.vacationCompensation +
      frontendSalaryPayrollEarnings.specialBonuses.reduce(
        (acc, bonus) => acc + bonus.amount,
        0
      ) +
      guaranteedIncome +
      simplePayrollEarnings.simpleOvertimeHours +
      simplePayrollEarnings.tripleOvertimeHours +
      simplePayrollEarnings.traniningActivitySupport +
      simplePayrollEarnings.physicalActivitySupport;

    const uma = rawData.salaryData.uma;
    const profitSharingBase = Math.min(
      frontendSalaryPayrollEarnings.profitSharing,
      15 * uma
    );

    const overtimeBase = Math.min(
      simplePayrollEarnings.doubleOvertimeHours / 2,
      5 * uma
    );

    const vacationBonusBase = Math.min(
      simplePayrollEarnings.vacationBonus,
      15 * uma
    );

    const isrBase =
      isrBaseComplete +
      profitSharingBase +
      overtimeBase +
      vacationBonusBase -
      attendanceDiscounts;

    const shouldReceiveSubsidy =
      isrBase < rawData.salaryData.employmentSubsidyLimit / 2;

    const employmentSubsidy = shouldReceiveSubsidy
      ? rawData.salaryData.employmentSubsidyAmount / 2
      : 0;

    return {
      employmentSubsidy,
      incomeTaxWithholding: this.calculateIsr(
        isrBase,
        rawData.salaryData.halfMonthIsrRates
      ),
    };
  }

  private calculateOtherDeductions(
    rawData: PayrollCollaboratorRawData,
    attendanceFactor: number,
    payrollDraft?: PayrollEstimate
  ): OtherDeductions {
    const imss = this.calculateSocialSecurityWithholding(
      rawData.employment.contributionBaseSalary,
      rawData.salaryData
    );
    const otherVariableDeductions =
      payrollDraft?.deductions.otherVariableDeductions ?? [];

    const otherFixedDeductions = rawData.employment.otherDeductions.map(
      (deduction) => ({
        name: deduction.name,
        description: deduction.name,
        amount: deduction.amount / 2, // Half month
      })
    );

    return {
      socialSecurityWithholding: imss.employeeImssRate * attendanceFactor,
      employerSocialSecurityCost: imss.employerImssRate * attendanceFactor,
      otherFixedDeductions,
      otherVariableDeductions,
    };
  }

  private buildPayrollEstimate({
    periodStartDate,
    periodEndDate,
    generalData,
    attendanceDiscounts,
    attendanceFactor,
    simplePayrollEarnings,
    frontendSalaryPayrollEarnings,
    guaranteedIncome,
    incomeTaxConcepts,
    otherDeductions,
    rawData,
  }: BuildPayrollEstimateArgs): PayrollEstimate {
    const earnings: PayrollEarnings = {
      ...simplePayrollEarnings,
      ...frontendSalaryPayrollEarnings,
      guaranteedIncomeCompensation: guaranteedIncome,
      employmentSubsidy: incomeTaxConcepts.employmentSubsidy,
      absencesJustifiedByCompanyCompensation: 0,
    };
    const { employerSocialSecurityCost, ...employeeOtherDeductions } =
      otherDeductions;
    const deductions: PayrollDeductions = {
      ...attendanceDiscounts,
      ...employeeOtherDeductions,
      incomeTaxWithholding: incomeTaxConcepts.incomeTaxWithholding,
    };
    const totalEarnings = this.calculateTotalConcepts(earnings);
    const totalDeductions = this.calculateTotalConcepts(deductions);
    const totals: PayrollTotals = {
      totalIncome: totalEarnings,
      totalDeductions: totalDeductions,
      netPay: totalEarnings - totalDeductions,
    };

    return {
      collaboratorId: rawData.collaborator.id!,
      payrollStatus: PayrollStatus.Pending,
      periodStartDate: new Date(periodStartDate),
      periodEndDate: new Date(periodEndDate),
      generalData,
      earnings,
      deductions,
      totals,
      contextData: {
        employerImssRate: employerSocialSecurityCost / attendanceFactor,
        workedHours: rawData.attendanceReport.periodHours.workedHours,
        attendanceFactor,
      },
    };
  }

  private calculateTotalConcepts(object: any): number {
    return Object.entries(object)
      .filter(([key, value]) => typeof value === "number")
      .reduce((sum, [key, value]) => sum + (value as number), 0);
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

type BuildPayrollEstimateArgs = {
  periodStartDate: string;
  periodEndDate: string;
  generalData: PayrollGeneralData;
  attendanceDiscounts: AttendanceDiscounts;
  attendanceFactor: number;
  simplePayrollEarnings: SimpleSalaryPayrollEarnings;
  frontendSalaryPayrollEarnings: FrontendSalaryPayrollEarnings;
  guaranteedIncome: number;
  incomeTaxConcepts: incomeTaxConcepts;
  otherDeductions: OtherDeductions;
  rawData: PayrollCollaboratorRawData;
};
