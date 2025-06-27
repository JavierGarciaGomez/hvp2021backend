import { PayrollEntity, SalaryDataEntity } from "../../domain/entities";
import { BaseService } from "./base.service";
import { isrRate, PayrollRepository, PayrollStatus } from "../../domain";
import { PayrollDTO } from "../dtos";
import {
  PayrollCollaboratorRawData,
  PayrollEstimate,
  PayrollEstimateRelevantValues,
} from "../../domain/read-models/payroll-estimate.rm";
import {
  BaseError,
  CustomQueryOptions,
  DAILY_WORK_HOURS,
  MONTH_DAYS,
  MONTH_WORK_DAYS,
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
      await this.employmentService.getEmploymentByCollaboratorAndDate(
        collaboratorId,
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
    const { minimumWageHVP, uma, halfMonthIsrRates } = salaryData;
    const {
      concludedWeeksHours,
      periodHours,
      punctualityBonus: hasPunctualityBonus,
    } = attendanceReport;
    const { expressBranchCompensation: jobExpressBranchCompensation } = job;
    const {
      weeklyHours,
      employmentFixedIncomeByJob: employmentFixedIncome,
      employmentDegreeBonus: employmentDegreeBonus,
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
    const periodDaysLength =
      dayjs(periodEndDate)
        .tz("America/Mexico_City")
        .diff(dayjs(periodStartDate).tz("America/Mexico_City"), "day") + 1;
    const halfWeekPayrollFixedIncome = employmentFixedIncome / 2;
    const collaboratorDailyWorkHours = weeklyHours / 6;
    const dailyNominalFixedIncome = employmentFixedIncome / MONTH_DAYS;
    const dailyEffectiveFixedIncome = employmentFixedIncome / MONTH_WORK_DAYS;

    const hourlyNominalFixedIncome =
      employmentFixedIncome / MONTH_DAYS / collaboratorDailyWorkHours; // for extra hours
    const hourlyEffectiveFixedIncome =
      dailyEffectiveFixedIncome / collaboratorDailyWorkHours; // for discount days

    // Calculate derived values since these fields were removed
    const averageOrdinaryIncome = employmentFixedIncome;
    const averageCommissionIncome = 0; // Default to 0 or calculate based on business logic

    const averageOrdinaryIncomeDaily = averageOrdinaryIncome / MONTH_DAYS;
    const averageOrdinaryIncomeHourly =
      averageOrdinaryIncomeDaily / collaboratorDailyWorkHours;

    const hvpMinWageDaily = minimumWageHVP / MONTH_DAYS;
    const hvpMinWageHourly = hvpMinWageDaily / DAILY_WORK_HOURS;

    const monthlyMinOrdinaryIncome = Math.max(
      averageOrdinaryIncome,
      minimumWageHVP
    );
    const dailyMinOrdinaryIncome = Math.max(
      averageOrdinaryIncomeDaily,
      hvpMinWageDaily
    );
    const hourlyMinOrdinaryIncomeHourly = Math.max(
      averageOrdinaryIncomeHourly,
      hvpMinWageHourly
    );

    const averageCommissionIncomeDaily = averageCommissionIncome / MONTH_DAYS;

    // fixed income
    /// non computable discount nominalFixedIncome
    const totalNonComputableHours = nonComputableHours;
    const nonComputableDays =
      totalNonComputableHours / collaboratorDailyWorkHours;
    const nonComputableDaysRatio = nonComputableDays / periodDaysLength;
    const nonComputableDiscount =
      nonComputableDaysRatio * halfWeekPayrollFixedIncome;

    /// absence: discount effectiveFixedIncome
    const totalAbsenceDayHours =
      justifiedAbsenceByCompanyHours +
      unjustifiedAbsenceHours +
      authorizedUnjustifiedAbsenceHours;
    const absenceDiscount = totalAbsenceDayHours * hourlyEffectiveFixedIncome;

    const totalSickLeaveHours = sickLeaveHours;

    const sickLeaveDays = totalSickLeaveHours / collaboratorDailyWorkHours;
    const absenceDays =
      (totalAbsenceDayHours + notWorkedHours) / collaboratorDailyWorkHours;

    const sickLeaveDiscount = totalSickLeaveHours * hourlyEffectiveFixedIncome;

    const notWorkedDiscount = notWorkedHours * hourlyEffectiveFixedIncome;

    const fixedIncomeDiscounts =
      nonComputableDiscount +
      sickLeaveDiscount +
      absenceDiscount +
      notWorkedDiscount;

    const fixedIncome = Math.max(
      halfWeekPayrollFixedIncome - fixedIncomeDiscounts,
      0
    );

    const attendanceProportion = fixedIncome / halfWeekPayrollFixedIncome;

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
      Math.max(0, monthlyMinOrdinaryIncome / 2 - subTotalMinimumIncome) *
      attendanceProportion;

    // todo: year end bonus
    const yearEndBonus = 0;

    // vacation bonus
    const vacationBonus =
      vacationDays * dailyMinOrdinaryIncome * VACATION_BONUS_PERCENTAGE;

    // todo: profit sharing
    const profitSharing = 0;

    // extra hours
    const extraHoursSinglePlay =
      singlePlayWorkedExtraHours * hourlyMinOrdinaryIncomeHourly;
    const extraHoursDoublePlay =
      doublePlayWorkedExtraHours * hourlyMinOrdinaryIncomeHourly * 2;
    const extraHoursTriplePlay =
      triplePlayWorkedExtraHours * hourlyMinOrdinaryIncomeHourly * 3;

    // sunday bonus
    const sundayBonusExtraPay =
      workedSundayHours *
      hourlyMinOrdinaryIncomeHourly *
      SUNDAY_BONUS_PERCENTAGE;

    // holiday or rest extra pay
    // const holidayOrRestHours = publicHolidaysHours + restWorkedHours;
    const holidayOrRestHours = publicHolidaysHours + restWorkedHours;
    const holidayOrRestExtraPay =
      holidayOrRestHours *
      hourlyMinOrdinaryIncomeHourly *
      HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE;

    // punctualityBonus
    const punctualityBonus = hasPunctualityBonus ? dailyMinOrdinaryIncome : 0;

    // meal compensation
    const mealCompensation = mealDays * DAILY_MEAL_COMPENSATION;
    // reception bonus - removed from employment entity
    const receptionBonus = 0;
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
          ? compensationAmount * attendanceProportion
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
    const isr = this.calculateIsr(isrBase, salaryData.halfMonthIsrRates);

    const { employerImssRate, employeeImssRate } =
      this.calculateSocialSecurityWithholding(
        employmentContributionBaseSalary,
        salaryData
      );

    const otherDeductions = employment.otherDeductions.map((deduction) => {
      return {
        name: deduction.name,
        amount: deduction.amount / 2,
      };
    });

    const totalDeductions =
      isr +
      employeeImssRate +
      otherDeductions.reduce((acc, deduction) => acc + deduction.amount, 0);

    // TODO: EMPLOYMENT SUBSIDY -> THIS GOES TO FRONTEND
    // TODO: COMISSIONSç

    const relevantValues: PayrollEstimateRelevantValues = {
      fixedIncomeDiscounts,
      nominalHourlyWage: hourlyEffectiveFixedIncome,
      attendanceProportion,
      averageOrdinaryIncomeHourly,
      minOrdinaryIncomeDaily: dailyMinOrdinaryIncome,
      minOrdinaryIncomeHourly: hourlyMinOrdinaryIncomeHourly,
      mealDays,
      isrBase,
      employerImssRate,
    };
    const payroll: PayrollEntity = new PayrollEntity({
      // references
      collaboratorId: collaborator.id!,
      employmentId: employment.id!,
      jobId: job.id!,
      // collaboratorData
      collaboratorFullName: `${collaborator.first_name} ${collaborator.last_name}`,
      collaboratorCode: collaborator.col_code,
      curp: collaborator.curp ?? "",
      socialSecurityNumber: collaborator?.imssNumber || "",
      rfcNumber: collaborator?.rfcCode || "",
      // jobData
      jobTitle: job.title,
      paymentType: employmentPaymentType,
      contributionBaseSalary: employmentContributionBaseSalary,
      collaboratorStartDate: collaborator.startDate ?? new Date(),
      collaboratorEndDate: collaborator.endDate ?? new Date(),
      // payrollData
      payrollStartDate: new Date(periodStartDate),
      payrollEndDate: new Date(periodEndDate),
      paymentDate: new Date(),
      sickLeaveDays: sickLeaveDays,
      absencesDays: absenceDays,
      payrollStatus: PayrollStatus.Pending,
      // INCOME
      // income - fixed
      fixedIncome: fixedIncome,
      // income - commissions
      commissions,
      // income - similarToCommissions
      vacationsCompensation,
      justifiedAbsencesCompensation: justifiedAbsencesCompensation,
      expressBranchCompensation: expressBranchCompensation,
      minimumOrdinaryIncomeCompensation: minimumOrdinaryIncomeCompensation,
      // income - legal allowances
      yearEndBonus,
      vacationBonus: vacationBonus,
      profitSharing,
      employmentSubsidy,
      // income - extra legal compensations
      extraHoursSinglePlay: extraHoursSinglePlay,
      extraHoursDoublePlay: extraHoursDoublePlay,
      extraHoursTriplePlay: extraHoursTriplePlay,
      sundayBonusExtraPay: sundayBonusExtraPay,
      holidayOrRestExtraPay: holidayOrRestExtraPay,
      // income - company benefits
      punctualityBonus: punctualityBonus,
      mealCompensation: mealCompensation,
      receptionBonus: receptionBonus,
      degreeBonus: degreeBonus * attendanceProportion,
      trainingSupport: trainingSupport * attendanceProportion,
      physicalActivitySupport: physicalActivitySupport * attendanceProportion,
      extraCompensations: extraCompensations,
      specialCompensation,
      // DEDUCTIONS
      incomeTaxWithholding: isr,
      socialSecurityWithholding: 0,
      infonavitLoanWithholding: 0,
      otherDeductions,
      // TOTAL
      totalIncome,
      totalDeductions,
      netPay: totalIncome - totalDeductions,
    });

    return { payroll, relevantValues };
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
}
