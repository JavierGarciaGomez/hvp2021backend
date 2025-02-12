import { PayrollEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { PayrollRepository, PayrollStatus } from "../../domain";
import { PayrollDTO } from "../dtos";
import {
  PayrollCollaboratorRawData,
  PayrollEstimate,
} from "../../domain/read-models/payroll-estimate";
import {
  BaseError,
  CustomQueryOptions,
  DAILY_WORK_HOURS,
  MONTH_DAYS,
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
import { CollaboratorAttendanceReport } from "../../domain/read-models";
import {
  DAILY_MEAL_COMPENSATION,
  HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE,
  JUSTIFIED_ABSENCES_PERCENTAGE,
  SUNDAY_BONUS_PERCENTAGE,
} from "../../shared/constants/hris.constants";

export class PayrollService extends BaseService<PayrollEntity, PayrollDTO> {
  attendanceReportService = createAttendanceReportService();
  employmentService = createEmploymentService();
  jobService = createJobService();
  collaboratorService = createCollaboratorService();
  salaryDataService = createSalaryDataService();
  constructor(protected readonly repository: PayrollRepository) {
    super(repository, PayrollEntity);
  }

  public getPayrollEstimates = async (
    queryOptions: CustomQueryOptions
  ): Promise<PayrollEstimate[]> => {
    const payrollEstimates: PayrollEstimate[] = [];
    return payrollEstimates;
  };

  public getPayrollEstimateByCollaboratorId = async (
    collaboratorId: string,
    queryOptions: CustomQueryOptions
  ): Promise<PayrollEstimate> => {
    const { periodStartDate, periodEndDate, specialCompensation, commissions } =
      queryOptions?.filteringDto ?? {};
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

    const numberCommissions = Number(commissions);
    const numberSpecialCompensation = Number(specialCompensation || 0);

    const payrollEstimate = await this.generatePayrollEstimate(
      collaboratorId,
      periodStartDate,
      periodEndDate,
      numberCommissions,
      numberSpecialCompensation
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
    commissions: number,
    specialCompensation: number
  ) {
    const rawData = await this.getRawData(
      collaboratorId,
      periodStartDate,
      periodEndDate
    );

    const payroll = this.calculateAll(
      rawData,
      periodStartDate,
      periodEndDate,
      commissions,
      specialCompensation
    );

    return payroll;
  }

  private async getRawData(
    collaboratorId: string,
    periodStartDate: string,
    periodEndDate: string
  ): Promise<PayrollCollaboratorRawData> {
    const collaborator = await this.collaboratorService.getById(collaboratorId);
    if (!collaborator) {
      throw BaseError.notFound("Collaborator not found");
    }
    const employment =
      await this.employmentService.getEmploymentByCollaboratorAndPeriod(
        collaboratorId,
        periodStartDate,
        periodEndDate
      );
    if (!employment) {
      throw BaseError.notFound("Employment not found");
    }
    const job = await this.jobService.getById(employment.jobId);
    if (!job) {
      throw BaseError.notFound("Job not found");
    }
    const attendanceReport =
      await this.attendanceReportService.getByCollaboratorId(collaboratorId, {
        filteringDto: {
          periodStartDate,
          periodEndDate,
        },
      });
    if (!attendanceReport) {
      throw BaseError.notFound("Attendance report not found");
    }
    const salaryDataResponse = await this.salaryDataService.getAll({
      filteringDto: {
        year: new Date(periodEndDate).getFullYear(),
      },
    });
    const salaryData = salaryDataResponse[0];
    if (!salaryData) {
      throw BaseError.notFound("Salary data not found");
    }

    return {
      collaborator,
      employment,
      job,
      attendanceReport,
      salaryData,
    };
  }

  private calculateAll(
    rawData: PayrollCollaboratorRawData,
    periodStartDate: string,
    periodEndDate: string,
    commissions: number,
    specialCompensation: number
  ) {
    const { collaborator, employment, job, attendanceReport, salaryData } =
      rawData;
    const { minimumWageHVP, uma } = salaryData;
    const {
      concludedWeeksHours,
      periodHours,
      punctualityBonus: hasPunctualityBonus,
    } = attendanceReport;
    const { expressBranchCompensation: jobExpressBranchCompensation } = job;
    const {
      weeklyHours,
      fixedIncome: employmentFixedIncome,
      averageOrdinaryIncome,
      averageCommissionIncome,
      minimumOrdinaryIncome,
      receptionBonus: employmentReceptionBonus,
      degreeBonus: employmentDegreeBonus,
      trainingSupport: employmentTrainingSupport,
      physicalActivitySupport: employmentPhysicalActivitySupport,
      extraCompensations: employmentExtraCompensations,
      paymentType: employmentPaymentType,
      contributionBaseSalary: employmentContributionBaseSalary,
    } = employment;
    const {
      justifiedAbsenceByCompanyHours,
      nonComputableHours,
      sickLeaveHours,
      authorizedUnjustifiedAbsenceHours,
      unjustifiedAbsenceHours,
      vacationHours,
      workedSundayHours,
      publicHolidaysHours,
      expressHours,
      mealDays,
    } = periodHours;
    const {
      notWorkedHours,
      singlePlayWorkedExtraHours,
      doublePlayWorkedExtraHours,
      triplePlayWorkedExtraHours,
      restWorkedHours,
    } = concludedWeeksHours;
    // GENERAL VARIABLES
    const payrollFixedIncome = employmentFixedIncome / 2;
    const collaboratorDailyWorkHours = weeklyHours / 6;
    const effectiveHourlyWage =
      employmentFixedIncome / MONTH_DAYS / collaboratorDailyWorkHours; // for extra hours
    const nominalHourlyWage =
      employmentFixedIncome /
      (WEEKS_IN_MONTH * WEEK_WORK_DAYS) /
      collaboratorDailyWorkHours; // for discount days

    const averageOrdinaryIncomeDaily = averageOrdinaryIncome / MONTH_DAYS;
    const averageOrdinaryIncomeHourly =
      averageOrdinaryIncomeDaily / collaboratorDailyWorkHours;

    const hvpMinWageDaily = minimumWageHVP / MONTH_DAYS;
    const hvpMinWageHourly = hvpMinWageDaily / DAILY_WORK_HOURS;

    const minOrdinaryIncome = Math.max(averageOrdinaryIncome, minimumWageHVP);
    const minOrdinaryIncomeDaily = Math.max(
      averageOrdinaryIncomeDaily,
      hvpMinWageDaily
    );
    const minOrdinaryIncomeHourly = Math.max(
      averageOrdinaryIncomeHourly,
      hvpMinWageHourly
    );

    const averageCommissionIncomeDaily = averageCommissionIncome / MONTH_DAYS;

    // fixed income
    const totalNonComputableHours = nonComputableHours;
    const totalAbsenceDayHours =
      justifiedAbsenceByCompanyHours +
      unjustifiedAbsenceHours +
      authorizedUnjustifiedAbsenceHours;
    const totalSickLeaveHours = sickLeaveHours;

    const nonComputableDays =
      totalNonComputableHours / collaboratorDailyWorkHours;
    const sickLeaveDays = totalSickLeaveHours / collaboratorDailyWorkHours;
    const absenceDays = totalAbsenceDayHours / collaboratorDailyWorkHours;

    const nonComputableDiscount = totalNonComputableHours * nominalHourlyWage;
    const sickLeaveDiscount = totalSickLeaveHours * nominalHourlyWage;
    const absenceDiscount = totalAbsenceDayHours * nominalHourlyWage;
    const notWorkedDiscount = notWorkedHours * nominalHourlyWage;

    const fixedIncome = Math.max(
      payrollFixedIncome -
        nonComputableDiscount -
        sickLeaveDiscount -
        absenceDiscount -
        notWorkedDiscount,
      0
    );

    const atttendanceProportion = fixedIncome / payrollFixedIncome;

    // todo: commissions

    // *** SIMILAR TO COMISSIONS ***

    // vacation compensation

    const vacationDays = vacationHours / collaboratorDailyWorkHours;
    const vacationsCompensation = vacationDays * averageCommissionIncomeDaily;

    // justified absences compensation

    const justifiedAbsencesDays =
      justifiedAbsenceByCompanyHours / collaboratorDailyWorkHours;

    const justifiedAbsencesCompensation =
      averageOrdinaryIncomeHourly *
      justifiedAbsenceByCompanyHours *
      JUSTIFIED_ABSENCES_PERCENTAGE;

    // express branch compensation
    const expressBranchCompensation =
      (expressHours * jobExpressBranchCompensation) / DAILY_WORK_HOURS;

    // minimum ordinary income compensation
    const subTotalMinimumIncome =
      fixedIncome +
      vacationsCompensation +
      justifiedAbsencesCompensation +
      expressBranchCompensation +
      commissions;

    const minimumOrdinaryIncomeCompensation =
      Math.max(0, minOrdinaryIncome / 2 - subTotalMinimumIncome) *
      atttendanceProportion;

    // todo: year end bonus
    const yearEndBonus = 0;

    // vacation bonus
    const vacationBonus =
      vacationDays * minOrdinaryIncomeDaily * VACATION_BONUS_PERCENTAGE;

    // todo: profit sharing
    const profitSharing = 0;

    // extra hours
    const extraHoursSinglePlay =
      singlePlayWorkedExtraHours * minOrdinaryIncomeHourly;
    const extraHoursDoublePlay =
      doublePlayWorkedExtraHours * minOrdinaryIncomeHourly * 2;
    const extraHoursTriplePlay =
      triplePlayWorkedExtraHours * minOrdinaryIncomeHourly * 3;

    // sunday bonus
    const sundayBonusExtraPay =
      workedSundayHours * minOrdinaryIncomeHourly * SUNDAY_BONUS_PERCENTAGE;

    // holiday or rest extra pay
    // const holidayOrRestHours = publicHolidaysHours + restWorkedHours;
    const holidayOrRestHours = publicHolidaysHours + restWorkedHours;
    const holidayOrRestExtraPay =
      holidayOrRestHours *
      minOrdinaryIncomeHourly *
      HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE;

    // punctualityBonus
    const punctualityBonus = hasPunctualityBonus ? minOrdinaryIncomeDaily : 0;

    // meal compensation
    const mealCompensation = mealDays * DAILY_MEAL_COMPENSATION;
    // reception bonus
    const receptionBonus = employmentReceptionBonus / 2;
    // degree bonus
    const degreeBonus = employmentDegreeBonus / 2;
    // training support
    const trainingSupport = employmentTrainingSupport / 2;
    // physical activity support
    const physicalActivitySupport = employmentPhysicalActivitySupport / 2;
    // extra compensations
    const extraCompensations = employmentExtraCompensations.map(
      (compensation) => {
        const compensationAmount = compensation.amount / 2;
        const compensationAdjusted = compensation.attendanceRelated
          ? compensationAmount * atttendanceProportion
          : compensationAmount;

        return {
          ...compensation,
          amount: compensationAdjusted,
        };
      }
    );

    // todo employment subsidy

    const totalIncomeWithoutSubsidy =
      fixedIncome +
      commissions +
      vacationsCompensation +
      justifiedAbsencesCompensation +
      expressBranchCompensation +
      minimumOrdinaryIncomeCompensation +
      yearEndBonus +
      vacationBonus +
      profitSharing +
      extraHoursSinglePlay +
      extraHoursDoublePlay +
      extraHoursTriplePlay +
      sundayBonusExtraPay +
      holidayOrRestExtraPay +
      punctualityBonus +
      mealCompensation +
      receptionBonus +
      degreeBonus +
      trainingSupport +
      physicalActivitySupport +
      extraCompensations.reduce(
        (acc, compensation) => acc + compensation.amount,
        0
      ) +
      specialCompensation;

    // TODO
    const shouldReceiveSubsidy =
      totalIncomeWithoutSubsidy < salaryData.employmentSubsidyLimit / 2;

    const employmentSubsidy = shouldReceiveSubsidy
      ? salaryData.employmentSubsidyAmount / 2
      : 0;

    const totalIncome = totalIncomeWithoutSubsidy + employmentSubsidy;

    const payroll: PayrollEntity = new PayrollEntity({
      collaboratorId: collaborator.id!,
      employmentId: employment.id!,
      jobId: job.id!,
      collaboratorFullName: `${collaborator.first_name} ${collaborator.last_name}`,
      collaboratorCode: collaborator.col_code,
      curp: collaborator.curp ?? "",
      socialSecurityNumber: collaborator?.imssNumber || "",
      rfcNumber: collaborator?.rfcCode || "",
      jobTitle: job.title,
      paymentType: employmentPaymentType,
      contributionBaseSalary: employmentContributionBaseSalary,
      collaboratorStartDate: collaborator.startDate ?? new Date(),
      collaboratorEndDate: collaborator.endDate ?? new Date(),
      payrollStartDate: new Date(periodStartDate),
      payrollEndDate: new Date(periodEndDate),
      paymentDate: new Date(),
      sickLeaveDays: sickLeaveDays,
      absencesDays: absenceDays,
      payrollStatus: PayrollStatus.Pending,
      fixedIncome: fixedIncome,
      commissions,
      vacationsCompensation,
      justifiedAbsencesCompensation: justifiedAbsencesCompensation,
      expressBranchCompensation: expressBranchCompensation,
      minimumOrdinaryIncomeCompensation: minimumOrdinaryIncomeCompensation,
      yearEndBonus,
      vacationBonus: vacationBonus,
      profitSharing,
      employmentSubsidy,
      extraHoursSinglePlay: extraHoursSinglePlay,
      extraHoursDoublePlay: extraHoursDoublePlay,
      extraHoursTriplePlay: extraHoursTriplePlay,
      sundayBonusExtraPay: sundayBonusExtraPay,
      holidayOrRestExtraPay: holidayOrRestExtraPay,
      punctualityBonus: punctualityBonus,
      mealCompensation: mealCompensation,
      receptionBonus: receptionBonus,
      degreeBonus: degreeBonus * atttendanceProportion,
      trainingSupport: trainingSupport * atttendanceProportion,
      physicalActivitySupport: physicalActivitySupport * atttendanceProportion,
      extraCompensations: extraCompensations,
      specialCompensation,
      incomeTaxWithholding: 0,
      socialSecurityWithholding: 0,
      infonavitLoanWithholding: 0,
      otherDeductions: [],
      totalIncome,
      totalDeductions: 0,
      netPay: 0,
    });

    // *** DEDUCTIONS

    // ISR base
    /* Dedudcionts ISR
    https://runahr.com/mx/recursos/ingresos-exentos-de-isr/
    - profit sharing 100%
    - aguinaldo hasta por 30 UMA
    - horas extras 50% por las horas dobles hasta 5 UMA
    - prima dominical 1 Uma por domingo
    - prima vacacional hasta 15 UMA

    - Other deductions
    */

    const yearEndBonusExemption = 30 + uma;
    const yearEndBonusDifference = Math.max(
      0,
      yearEndBonus - yearEndBonusExemption
    );
    const profitSharingExemption = profitSharing;

    const maxExtraHoursExemtpion = (5 * uma) / 2;
    const extraHoursExemption = extraHoursDoublePlay * 0.5;
    const extraHoursDifference = Math.min(
      extraHoursExemption,
      maxExtraHoursExemtpion
    );

    const workedSundays = Math.floor(
      workedSundayHours / collaboratorDailyWorkHours
    );
    const maxSundayBonusExemption = workedSundays * uma;
    const sundayBonusDifference = Math.min(
      maxSundayBonusExemption,
      sundayBonusExtraPay
    );

    const maxVacationBonusExemption = 15 * uma;
    const vacationBonusDifference = Math.min(
      maxVacationBonusExemption,
      vacationBonus
    );

    const totalExemption =
      yearEndBonusDifference +
      profitSharingExemption +
      extraHoursDifference +
      sundayBonusDifference +
      vacationBonusDifference;

    const isrBase = totalIncome - totalExemption;

    // TODO: EMPLOYMENT SUBSIDY -> THIS GOES TO FRONTEND
    // TODO: COMISSIONS

    return { payroll };
  }

  private calculateIsr(isrBase: number) {}
}
