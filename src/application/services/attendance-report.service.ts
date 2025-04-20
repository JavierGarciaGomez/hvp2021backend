import dayjs, { Dayjs } from "dayjs";
import {
  AttendanceRawData,
  CollaboratorAttendanceData,
  CollaboratorAttendanceReport,
  CollaboratorAttendanceReportWrapper,
  CollaboratorDayReport,
  DayReportData,
  PeriodHours,
  ProcessedAttendanceRawData,
} from "../../domain/read-models";
import {
  BaseError,
  calculateProportionalHours,
  convertUtcDateToMexicoTimeStartOfDay,
  CustomQueryOptions,
  getDayjsRangeFromDates,
  getFirstMondayOfExtendedHalfWeek,
  getLastSundayOfExtendedHalfWeek,
  getMxDayjsDatetimeByDateAndTime,
  getPreviousSunday,
  isDatetimeAfter,
  isDatetimeBefore,
  minutesBetweenDatetimes,
  toMexicoStartOfDay,
  transformMxDateTimeToEsStartOfDay,
  transformMxDateTimeToUtcStartOfDay,
} from "../../shared";
import {
  createAttendanceRecordService,
  createBranchService,
  createCollaboratorService,
  createEmploymentService,
  createJobService,
  createPublicHolidaysService,
  createTimeOffRequestService,
  createWeekShiftService,
} from "../factories";
import {
  AttendanceRecordEntity,
  AttendanceRecordEntityDayJs,
  BranchEntity,
  CollaboratorEntity,
  EmploymentEntity,
  JobEntity,
  PublicHolidaysEntity,
  TimeOffRequestDayJs,
  TimeOffRequestEntity,
  TimeOffStatus,
  TimeOffType,
  WeekShiftEntity,
  WorkingDayType,
} from "../../domain";
import { CollaboratorShiftDayJs } from "../../domain/value-objects/day-shift.vo";
import {
  MAX_DOUBLE_PLAY_WORK_WEEK_LIMIT,
  MAX_WORK_WEEK_LIMIT,
} from "../../shared/constants/hris.constants";

export class AttendanceReportService {
  weekshiftService = createWeekShiftService();
  timeOffRequestService = createTimeOffRequestService();
  attendanceRecordService = createAttendanceRecordService();
  jobService = createJobService();
  collaboratorService = createCollaboratorService();
  publicHolidaysService = createPublicHolidaysService();
  employmentService = createEmploymentService();
  branchService = createBranchService();

  // todo change any
  async getAll(
    queryOptions?: CustomQueryOptions
  ): Promise<CollaboratorAttendanceReport[]> {
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

    const attendanceReports = await this.generateAttendanceReports(
      periodStartDate,
      periodEndDate
    );

    return await Promise.all(attendanceReports);
  }

  // todo change any
  async getByCollaboratorId(
    collaboratorId: string,
    queryOptions?: CustomQueryOptions
  ): Promise<CollaboratorAttendanceReport> {
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

    const attendanceReports = await this.generateAttendanceReports(
      periodStartDate,
      periodEndDate,
      collaboratorId
    );

    return attendanceReports[0];
  }

  public getResourceName(): string {
    return "attendance-report";
  }

  private async generateAttendanceReports(
    periodStartDate: string,
    periodEndDate: string,
    collaboratorId?: string
  ): Promise<CollaboratorAttendanceReport[]> {
    const startDate = dayjs(periodStartDate);
    const endDate = dayjs(periodEndDate);
    const extendedStartDateMx = getFirstMondayOfExtendedHalfWeek(startDate);
    const extendedEndDateMx = getLastSundayOfExtendedHalfWeek(endDate);

    const attendanceRawData = await this.getAttendanceRawData(
      extendedStartDateMx,
      extendedEndDateMx,
      collaboratorId
    );

    const processedRawData = this.processRawData(attendanceRawData);

    const collaboratorsAttendanceData = this.generateCollaboratorAttendanceData(
      {
        collaborators: attendanceRawData.collaborators,
        processedDayShifts: processedRawData.processedDayShifts,
        processedAttendanceRecords: processedRawData.processedAttendanceRecords,
        processedTimeoffRequests: processedRawData.processedTimeoffRequests,
        processedPublicHolidays: processedRawData.processedPublicHolidays,
        employments: attendanceRawData.employments,
        jobs: attendanceRawData.jobs,
        branches: attendanceRawData.branches,
      }
    );

    const attendanceReports = collaboratorsAttendanceData.map(
      (attendanceData) =>
        this.generateAttendanceReport(
          attendanceData,
          startDate,
          endDate,
          extendedStartDateMx,
          extendedEndDateMx
        )
    );

    return attendanceReports;
  }

  private async getAttendanceRawData(
    extendedStartDateMx: dayjs.Dayjs,
    extendedEndDateMx: dayjs.Dayjs,
    collaboratorId?: string
  ): Promise<AttendanceRawData> {
    const weekShifts = await this.weekshiftService.getAll({
      filteringDto: {
        startingDate: {
          $gte: transformMxDateTimeToUtcStartOfDay(
            extendedStartDateMx
          ).toDate(),
        },
        endingDate: {
          $lte: transformMxDateTimeToUtcStartOfDay(extendedEndDateMx).toDate(),
        },
      },
    });

    const timeOffRequests = await this.timeOffRequestService.getAll({
      filteringDto: {
        requestedDays: {
          $gte: transformMxDateTimeToEsStartOfDay(extendedStartDateMx).toDate(),
          $lte: extendedEndDateMx.toDate(),
        },
        status: TimeOffStatus.Approved,
      },
    });

    const attendanceRecords = await this.attendanceRecordService.getAll({
      filteringDto: {
        shiftDate: {
          $gte: transformMxDateTimeToUtcStartOfDay(
            extendedStartDateMx
          ).toDate(),
          $lte: transformMxDateTimeToUtcStartOfDay(extendedEndDateMx).toDate(),
        },
      },
    });

    const jobs = await this.jobService.getAll({
      filteringDto: {
        active: true,
      },
    });

    let collaborators: CollaboratorEntity[] = [];

    if (collaboratorId) {
      collaborators = (await this.collaboratorService.getAll({
        filteringDto: {
          _id: collaboratorId,
        },
      })) as unknown as CollaboratorEntity[];

      if (collaborators.length === 0) {
        throw BaseError.notFound(
          `Collaborator with id ${collaboratorId} not found`
        );
      }
    } else {
      collaborators = (await this.collaboratorService.getAll({
        filteringDto: {
          active: true,
          startDate: { $lte: extendedEndDateMx.toDate() },
          $or: [
            { endDate: { $gte: extendedEndDateMx.toDate() } },
            { endDate: { $exists: false } },
          ],
        },
      })) as unknown as CollaboratorEntity[];
    }

    const startYear = extendedStartDateMx.year();
    const endYear = extendedEndDateMx.year();
    const years = Array.from(
      { length: endYear - startYear + 1 },
      (_, i) => startYear + i
    );

    const publicHolidays = await this.publicHolidaysService.getAll({
      filteringDto: {
        year: { $in: years },
      },
    });

    const employments = await this.employmentService.getAll({
      filteringDto: {
        employmentStartDate: { $lte: extendedEndDateMx.toDate() },
        $or: [
          { employmentEndDate: { $exists: false } },
          { employmentEndDate: { $gt: extendedStartDateMx.toDate() } },
        ],
      },
      sortingDto: {
        sort_by: "employmentStartDate",
        direction: "desc",
      },
    });

    const branches = await this.branchService.getAll({
      filteringDto: {
        active: true,
      },
    });

    return {
      startDate: extendedStartDateMx,
      endDate: extendedEndDateMx,
      weekShifts,
      timeOffRequests,
      attendanceRecords,
      jobs,
      collaborators,
      publicHolidays,
      employments,
      branches,
    };
  }

  private processRawData(args: AttendanceRawData): ProcessedAttendanceRawData {
    const { weekShifts, timeOffRequests, attendanceRecords, publicHolidays } =
      args;

    const processedDayShifts = this.extractCollaboratorsShiftsMx(weekShifts);
    const processedAttendanceRecords =
      this.processAttendanceRecordsForAttendanceReports(attendanceRecords);
    const processedTimeoffRequests =
      this.processTimeoffRequestsForAttendanceReports(timeOffRequests);
    const processedPublicHolidays =
      this.processPublicHolidaysForAttendanceReports(publicHolidays);
    return {
      processedDayShifts,
      processedAttendanceRecords,
      processedTimeoffRequests,
      processedPublicHolidays,
    };
  }

  private extractCollaboratorsShiftsMx(
    weekShifts: WeekShiftEntity[]
  ): CollaboratorShiftDayJs[] {
    const rawShifts = [];

    for (const weekShift of weekShifts) {
      rawShifts.push(...weekShift.shifts);
    }

    return rawShifts.map((shift) => {
      const { shiftDate, startingTime, endingTime } = shift;

      const shiftDateMx = convertUtcDateToMexicoTimeStartOfDay(shift.shiftDate);
      const startingTimeMx = startingTime
        ? getMxDayjsDatetimeByDateAndTime(shiftDate, startingTime)
        : undefined;

      if (shiftDate === "2025-04-06") {
        console.log("WAIT");
        console.log({
          shiftDate,
          startingTime,
          endingTime,
          startingTimeMx: startingTimeMx?.toISOString(),
        });
      }
      const endingTimeMx = endingTime
        ? getMxDayjsDatetimeByDateAndTime(shiftDate, endingTime)
        : undefined;

      return {
        ...shift,
        shiftDate: shiftDateMx,
        startingTime: startingTimeMx,
        endingTime: endingTimeMx,
      };
    });
  }

  private processAttendanceRecordsForAttendanceReports(
    attendanceRecords: AttendanceRecordEntity[]
  ): AttendanceRecordEntityDayJs[] {
    const attendanceRecord1 = attendanceRecords[0];

    return attendanceRecords.map((record, index) => {
      if (index === 0) {
        const myTest = {
          shiftDateIso: record.shiftDate,
          shiftDateDayJs: dayjs(record.shiftDate).toISOString(),
          shiftDateIso2: record.shiftDate.toISOString(),
          return: toMexicoStartOfDay(record.shiftDate).toISOString(),
        };
        console.log(myTest);
      }
      return {
        ...record,
        shiftDate: toMexicoStartOfDay(record.shiftDate),
        startTime: dayjs(record.startTime),
        endTime: record.endTime ? dayjs(record.endTime) : undefined,
      };
    });
  }

  private processTimeoffRequestsForAttendanceReports(
    timeoffRequests: TimeOffRequestEntity[]
  ): TimeOffRequestDayJs[] {
    return timeoffRequests.map((timeoffRequest) => ({
      ...timeoffRequest,
      requestedDays: timeoffRequest.requestedDays.map((day) =>
        toMexicoStartOfDay(day)
      ),
    }));
  }

  private processPublicHolidaysForAttendanceReports(
    yearPublicHolidays: PublicHolidaysEntity[]
  ): Dayjs[] {
    const newPublicHolidays: Dayjs[] = [];
    yearPublicHolidays.forEach((publicHoliday) => {
      newPublicHolidays.push(
        ...publicHoliday.publicHolidays.map((publicHoliday) =>
          toMexicoStartOfDay(publicHoliday)
        )
      );
    });

    return newPublicHolidays;
  }

  private generateCollaboratorAttendanceData(
    args: GenerateCollaboratorAttendanceDataArgs
  ): CollaboratorAttendanceData[] {
    const {
      collaborators,
      processedDayShifts,
      processedAttendanceRecords,
      processedTimeoffRequests,
      processedPublicHolidays,
      employments,
      jobs,
      branches,
    } = args;
    const collaboratorsAttendanceData = collaborators.map((collaborator) => ({
      collaborator,
      employment: employments.find(
        (employment) => employment.collaboratorId === collaborator.id
      ),
      job: jobs.find((job) => job.id === collaborator.jobId),
      dayShifts: [] as CollaboratorShiftDayJs[],
      attendanceRecords: [] as AttendanceRecordEntityDayJs[],
      timeOffRequests: [] as TimeOffRequestDayJs[],
      publicHolidays: processedPublicHolidays,
      branches,
    }));

    processedDayShifts.forEach((dayShift) => {
      const collaboratorAttendanceData = collaboratorsAttendanceData.find(
        (collaboratorAttendance) =>
          collaboratorAttendance.collaborator.id === dayShift.collaboratorId
      );
      if (collaboratorAttendanceData) {
        collaboratorAttendanceData.dayShifts.push(dayShift);
      }
    });

    processedAttendanceRecords.forEach((attendanceRecord) => {
      const collaboratorAttendanceData = collaboratorsAttendanceData.find(
        (collaboratorAttendance) =>
          collaboratorAttendance.collaborator.id ===
          attendanceRecord.collaborator
      );
      if (collaboratorAttendanceData) {
        collaboratorAttendanceData.attendanceRecords.push(attendanceRecord);
      }
    });

    processedTimeoffRequests.forEach((timeoffRequest) => {
      const collaboratorAttendanceData = collaboratorsAttendanceData.find(
        (collaboratorAttendance) =>
          collaboratorAttendance.collaborator.id === timeoffRequest.collaborator
      );
      if (collaboratorAttendanceData) {
        collaboratorAttendanceData.timeOffRequests.push(timeoffRequest);
      }
    });

    return collaboratorsAttendanceData;
  }

  private generateAttendanceReport(
    collaboratorAttendanceData: CollaboratorAttendanceData,
    startDate: dayjs.Dayjs,
    endDate: dayjs.Dayjs,
    extendedStartDate: dayjs.Dayjs,
    extendedEndDate: dayjs.Dayjs
  ): CollaboratorAttendanceReport {
    const { collaborator, employment, branches, publicHolidays } =
      collaboratorAttendanceData;

    const { startDate: collaboratorStartDate, endDate: collaboratorEndDate } =
      collaboratorAttendanceData.collaborator;

    if (collaboratorAttendanceData.collaborator.col_code === "JLP") {
      const firstAttendanceRecord =
        collaboratorAttendanceData.attendanceRecords[0];

      const firstShift = collaboratorAttendanceData.dayShifts[0];
      const myTest = {
        shiftDateIso: firstShift?.shiftDate,
        shiftDateDayJs: dayjs(firstShift?.shiftDate).toISOString(),
        shiftDateIso2: firstShift?.shiftDate?.toISOString(),
        attendanceRecordShiftDateIso: firstAttendanceRecord?.shiftDate,
        attendanceRecordShiftDateDayJs:
          dayjs(firstAttendanceRecord?.shiftDate).toISOString() || undefined,
        attendanceRecordShiftDateIso2:
          firstAttendanceRecord?.shiftDate?.toISOString() || undefined,
      };
      console.log(myTest);
    }

    const dayReportsData = this.generateDayReportsData(
      collaboratorAttendanceData,
      extendedStartDate,
      extendedEndDate,
      branches
    );

    // todo
    // transform dayReportsData to collaboratorDayReports
    const collaboratorDayReports = dayReportsData.map((dayReportData) =>
      this.generateCollaboratorDayReport(
        dayReportData,
        collaboratorStartDate
          ? dayjs(collaboratorStartDate)
          : dayjs("2016-01-01"),
        collaboratorEndDate ? dayjs(collaboratorEndDate) : dayjs("2030-01-01")
      )
    );

    // todo
    const relevantPeriodDates = getDayjsRangeFromDates(startDate, endDate);

    const relevantCollaboratorDaysReports = collaboratorDayReports.filter(
      (dayReport) =>
        relevantPeriodDates.some((validDate) =>
          validDate.isSame(dayReport.date, "day")
        )
    );

    const periodHours = this.calculateShiftHoursInPeriod(
      relevantCollaboratorDaysReports,
      employment?.weeklyHours || collaborator.weeklyHours || 48,
      publicHolidays
    );

    const concludedWeeksReports = collaboratorDayReports.filter((dayReport) =>
      dayReport.date.isSameOrBefore(getPreviousSunday(endDate), "day")
    );

    let tardiness = 0;
    let punctualityBonus = true;

    relevantCollaboratorDaysReports.forEach((dayReport) => {
      const delayMinutes = dayReport.delayMinutes || 0;
      const anticipatedMinutes = 0; // Always zero as per the original code

      if (delayMinutes >= 6 || anticipatedMinutes >= 6) {
        punctualityBonus = false;

        // Calculate tardiness points based on delay/anticipated minutes
        if (delayMinutes > 10 || anticipatedMinutes > 10) tardiness += 1;
        if (delayMinutes > 30 || anticipatedMinutes > 30) tardiness += 1;
        if (delayMinutes > 120 || anticipatedMinutes > 120) tardiness += 1;
      }
    });

    const concludedWeeksHours = this.getHoursByConcludedWeeks(
      employment?.weeklyHours || collaborator.weeklyHours || 48,
      concludedWeeksReports
    );

    return {
      collaboratorId: collaborator.id!,
      startDate: startDate.toDate(),
      endDate: endDate.toDate(),
      collaboratorDayReports,
      periodHours,
      concludedWeeksHours,
      tardiness,
      punctualityBonus,
    };
  }

  private generateDayReportsData(
    collaboratorAttendanceData: CollaboratorAttendanceData,
    extendedStartingDate: dayjs.Dayjs,
    extendedEndingDate: dayjs.Dayjs,
    branches: BranchEntity[]
  ): DayReportData[] {
    const {
      dayShifts,
      attendanceRecords,
      timeOffRequests,
      collaborator,
      employment,
      job,
    } = collaboratorAttendanceData;

    const days = getDayjsRangeFromDates(
      extendedStartingDate,
      extendedEndingDate
    );

    const dayReportsData: DayReportData[] = days.map((day) => ({
      date: day,
      shiftStart: undefined,
      shiftEnd: undefined,
      attendanceStart: undefined,
      attendanceEnd: undefined,
      timeOffRequestType: undefined,
      isRemote: false,
      branch: undefined,
    }));

    dayShifts.forEach((shift) => {
      const dayReportData = dayReportsData.find((dayReport) =>
        dayReport.date.isSame(shift.shiftDate, "day")
      );
      if (dayReportData) {
        dayReportData.shiftStart = shift.startingTime;
        dayReportData.shiftEnd = shift.endingTime;
        dayReportData.isRemote = shift.isRemote || false;
      }
    });

    attendanceRecords.forEach((attendanceRecord) => {
      const dayReport = dayReportsData.find((dayReport) =>
        dayReport.date.isSame(attendanceRecord.shiftDate, "day")
      );
      if (dayReport) {
        dayReport.attendanceStart = attendanceRecord.startTime;
        dayReport.attendanceEnd = attendanceRecord.endTime;
        dayReport.branch = branches.find(
          (branch) => branch.id === attendanceRecord.clockOutBranch
        )?.name;
      }
    });

    timeOffRequests
      .filter(
        (timeoffRequest) => timeoffRequest.status === TimeOffStatus.Approved
      )
      .forEach((timeoffRequest) => {
        timeoffRequest.requestedDays.forEach((day) => {
          const dayReport = dayReportsData.find((dayReport) =>
            dayReport.date.isSame(day, "day")
          );
          if (dayReport) {
            dayReport.timeOffRequestType = timeoffRequest.timeOffType;
          }
        });
      });

    return dayReportsData;
  }

  private generateCollaboratorDayReport(
    dayReportData: DayReportData,
    collaboratorStartDate: dayjs.Dayjs,
    collaboratorEndDate: dayjs.Dayjs
  ): CollaboratorDayReport {
    const {
      date,
      shiftStart,
      shiftEnd,
      attendanceStart,
      attendanceEnd,
      timeOffRequestType,
      isRemote,
      branch,
    } = dayReportData;

    const assignedHours =
      shiftStart && shiftEnd
        ? calculateProportionalHours(shiftStart, shiftEnd)
        : 0;

    const workedHours =
      attendanceEnd && attendanceStart
        ? calculateProportionalHours(attendanceStart, attendanceEnd)
        : 0;

    const delayMinutes =
      attendanceStart && shiftStart
        ? minutesBetweenDatetimes(shiftStart, attendanceStart)
        : 0;

    const anticipatedMinutes =
      attendanceEnd && shiftEnd
        ? minutesBetweenDatetimes(attendanceEnd, shiftEnd)
        : 0;

    const extraHours = workedHours - assignedHours;

    let dayReport: CollaboratorDayReport = {
      date,
      shiftStart,
      shiftEnd,
      attendanceStart,
      attendanceEnd,
      workingDayType: WorkingDayType.OrdinaryShift,
      assignedHours,
      workedHours,
      extraHours,
      delayMinutes,
      anticipatedMinutes,
      timeOffRequestType: timeOffRequestType,
      branch,
    };

    const setHoursToZero = (dayReport: CollaboratorDayReport) => {
      dayReport.assignedHours = 0;
      dayReport.workedHours = 0;
      dayReport.extraHours = 0;
      dayReport.delayMinutes = 0;
      dayReport.anticipatedMinutes = 0;
    };

    const setWorkedRelatedHoursToZero = (dayReport: CollaboratorDayReport) => {
      dayReport.workedHours = 0;
      dayReport.extraHours = 0;
      dayReport.delayMinutes = 0;
      dayReport.anticipatedMinutes = 0;
    };

    if (
      isDatetimeBefore(
        date,
        collaboratorStartDate ? collaboratorStartDate : date
      ) ||
      isDatetimeAfter(date, collaboratorEndDate ? collaboratorEndDate : date)
    ) {
      setHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.NonComputableShift;
      return dayReport;
    }

    if (timeOffRequestType === TimeOffType.Vacation) {
      setHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.Vacation;
      return dayReport;
    }

    if (timeOffRequestType === TimeOffType.PersonalLeave) {
      setHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.PersonalLeave;
      return dayReport;
    }

    if (workedHours + assignedHours === 0) {
      setHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.RestDay;
      return dayReport;
    }

    if (isRemote) {
      setWorkedRelatedHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.SimulatedAsistance;
      return dayReport;
    }

    if (timeOffRequestType === TimeOffType.SickLeaveIMSS) {
      setWorkedRelatedHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.SickLeave;
      return dayReport;
    }

    // todo force majeure
    if (timeOffRequestType === TimeOffType.ShiftToBeCompensated) {
      setWorkedRelatedHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.ShiftToBeCompensated;
      return dayReport;
    }

    if (timeOffRequestType === TimeOffType.JustifiedAbsenceByCompany) {
      setWorkedRelatedHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.JustifiedAbsenceByCompany;
      return dayReport;
    }

    if (timeOffRequestType === TimeOffType.AuthorizedUnjustifiedAbsence) {
      setWorkedRelatedHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.AuthorizedUnjustifiedAbsence;
      return dayReport;
    }

    if (assignedHours > 0 && !attendanceStart && !attendanceEnd) {
      setWorkedRelatedHoursToZero(dayReport);
      dayReport.workingDayType = WorkingDayType.UnjustifiedAbsence;
      return dayReport;
    }

    if (timeOffRequestType === TimeOffType.LatePermission) {
      dayReport.delayMinutes = 0;
      if (delayMinutes > 120) {
        dayReport.delayMinutes = delayMinutes - 120;
      }
      dayReport.workingDayType = WorkingDayType.LatePermission;
      return dayReport;
    }

    if (timeOffRequestType === TimeOffType.EarlyLeavePermission) {
      dayReport.anticipatedMinutes = 0;
      if (anticipatedMinutes > 120) {
        dayReport.anticipatedMinutes = anticipatedMinutes - 120;
      }
      dayReport.workingDayType = WorkingDayType.EarlyLeavePermission;
      return dayReport;
    }

    if (delayMinutes > 10) {
      dayReport.workingDayType = WorkingDayType.Tardiness;
      return dayReport;
    }

    if (anticipatedMinutes > 10) {
      dayReport.workingDayType = WorkingDayType.EarlyDeparture;
      return dayReport;
    }

    if (assignedHours === 0 && workedHours > 0) {
      dayReport.workingDayType = WorkingDayType.UnscheduledWork;
      return dayReport;
    }

    if (
      (attendanceStart && !attendanceEnd) ||
      (!attendanceStart && attendanceEnd)
    ) {
      dayReport.workingDayType = WorkingDayType.IncompleteRecord;
      setWorkedRelatedHoursToZero(dayReport);
      return dayReport;
    }

    dayReport.workingDayType = WorkingDayType.OrdinaryShift;
    return dayReport;
  }

  private calculateShiftHoursInPeriod(
    collaboratorDayReports: CollaboratorDayReport[],
    weeklyHours: number,
    publicHolidays?: Dayjs[]
  ): PeriodHours {
    const dailyWorkingHours = weeklyHours ? weeklyHours / 6 : 8;

    /*
      TODO
      globales
        horas totales válidas:
        horas de trabajo esperado:

      asignación de horas
        horas asignadas
      horas que se pagan
        horas trabajadas
        horas estimadas por falta de registro
        horas de asistencia simulada
        horas por fuerza mayor
        horas a reponer
        horas de vacaciones
        horas de asuntos propios

      horas que se pagan al 60%
        horas justificadas por la empresa
      horas que se descuentan o ignoran
        horas no computadas
        horas de reposición
        horas de incapacidad
        horas de falta injustificada autorizada
        horas de falta injustificada

      horas especiales
        horas de trabajo en día festivo
        horas de trabajo en día de descanso
        horas extraordinas simples
        horas extraordinarias dobles
        horas extraordinarias triples
    */

    const countAssignedHoursByWorkingDayType = (
      workingDayType: WorkingDayType
    ) => {
      return collaboratorDayReports
        .filter((dayReport) => dayReport.workingDayType === workingDayType)
        .reduce((acc, dayReport) => acc + dayReport.assignedHours, 0);
    };

    const estimateHoursByWorkingDayType = (workingDayType: WorkingDayType) => {
      return (
        collaboratorDayReports.filter(
          (dayReport) => dayReport.workingDayType === workingDayType
        ).length * dailyWorkingHours
      );
    };

    const workedHours = collaboratorDayReports.reduce(
      (acc, dayReport) => acc + dayReport.workedHours,
      0
    );

    const workedSundayHours = collaboratorDayReports
      .filter((dayReport) => dayReport.date.day() === 0)
      .reduce((acc, dayReport) => acc + dayReport.workedHours, 0);

    const estimatedWorkedHours =
      countAssignedHoursByWorkingDayType(WorkingDayType.IncompleteRecord) / 2;

    const simulatedAsistanceHours = countAssignedHoursByWorkingDayType(
      WorkingDayType.SimulatedAsistance
    );

    const toBeCompensatedHours = countAssignedHoursByWorkingDayType(
      WorkingDayType.ShiftToBeCompensated
    );

    const vacationHours = estimateHoursByWorkingDayType(
      WorkingDayType.Vacation
    );

    const personalLeaveHours = estimateHoursByWorkingDayType(
      WorkingDayType.PersonalLeave
    );

    const justifiedAbsenceByCompanyHours = countAssignedHoursByWorkingDayType(
      WorkingDayType.JustifiedAbsenceByCompany
    );

    const nonComputableHours = estimateHoursByWorkingDayType(
      WorkingDayType.NonComputableShift
    );

    const compensationHours = countAssignedHoursByWorkingDayType(
      WorkingDayType.CompensationShift
    );

    const sickLeaveHours = countAssignedHoursByWorkingDayType(
      WorkingDayType.SickLeave
    );

    const authorizedUnjustifiedAbsenceHours =
      countAssignedHoursByWorkingDayType(
        WorkingDayType.AuthorizedUnjustifiedAbsence
      );

    const unjustifiedAbsenceHours = countAssignedHoursByWorkingDayType(
      WorkingDayType.UnjustifiedAbsence
    );

    const publicHolidaysHours = publicHolidays
      ? collaboratorDayReports
          .filter((dayReport) =>
            publicHolidays.some((publicHoliday) =>
              dayjs(publicHoliday).isSame(dayReport.date, "day")
            )
          )
          .reduce((acc, dayReport) => acc + dayReport.workedHours, 0)
      : 0;

    const expressHours = collaboratorDayReports
      .filter((dayReport) => dayReport.branch === "Montejo")
      .reduce((acc, dayReport) => acc + dayReport.workedHours, 0);

    const mealDays = collaboratorDayReports.filter(
      (dayReport) => dayReport.workedHours > 8
    ).length;

    // obtain completed weeks

    // check if at least one day is a rest day

    return {
      workedHours,
      estimatedWorkedHours,
      simulatedAsistanceHours,
      toBeCompensatedHours,
      vacationHours,
      personalLeaveHours,
      justifiedAbsenceByCompanyHours,
      nonComputableHours,
      compensationHours,
      sickLeaveHours,
      authorizedUnjustifiedAbsenceHours,
      unjustifiedAbsenceHours,
      publicHolidaysHours,
      workedSundayHours,
      expressHours,
      mealDays,
    };
  }

  private getHoursByConcludedWeeks(
    weeklyHours: number,
    collaboratorDayReports: CollaboratorDayReport[]
  ) {
    let week = 0;

    const reportsByWeek = collaboratorDayReports.reduce((weeks, report) => {
      const weekDay = report.date.day();

      if (weekDay === 1) {
        week++;
      }

      if (!weeks[week]) {
        weeks[week] = [];
      }
      weeks[week].push(report);
      return weeks;
    }, {} as Record<number, CollaboratorDayReport[]>);

    let restWorkedHours = 0;
    let singlePlayWorkedExtraHours = 0;
    let doublePlayWorkedExtraHours = 0;
    let triplePlayWorkedExtraHours = 0;
    let notWorkedHours = 0;

    // Process each week
    Object.values(reportsByWeek).forEach((weekReports) => {
      // Check if there's a rest day, vacation day, or personal leave day
      const hasRestDay = weekReports.some((report) =>
        ["RestDay", "Vacation", "PersonalLeave"].includes(report.workingDayType)
      );

      const {
        workedHours,
        estimatedWorkedHours,
        simulatedAsistanceHours,
        toBeCompensatedHours,
        vacationHours,
        personalLeaveHours,
        justifiedAbsenceByCompanyHours,
        nonComputableHours,
        sickLeaveHours,
        authorizedUnjustifiedAbsenceHours,
        unjustifiedAbsenceHours,
      } = this.calculateShiftHoursInPeriod(weekReports, weeklyHours);

      const workedOrExcludedHours =
        workedHours +
        nonComputableHours +
        estimatedWorkedHours +
        simulatedAsistanceHours +
        toBeCompensatedHours +
        vacationHours +
        personalLeaveHours +
        justifiedAbsenceByCompanyHours +
        sickLeaveHours +
        authorizedUnjustifiedAbsenceHours +
        unjustifiedAbsenceHours;

      /*
        weekly = 35
        extrahours = 12
      */
      const extraHours = workedOrExcludedHours - weeklyHours;
      if (extraHours < 0) {
        notWorkedHours += extraHours;
      }

      const maxSinglePlayWorkedExtraHours = MAX_WORK_WEEK_LIMIT - weeklyHours; // 48 - 35 = 13
      const addToSinglePlayWorkedExtraHours = Math.max(
        Math.min(extraHours, maxSinglePlayWorkedExtraHours),
        0
      );
      const remainingExtraHours = extraHours - addToSinglePlayWorkedExtraHours;
      const maxDoublePlayWorkedExtraHours =
        MAX_DOUBLE_PLAY_WORK_WEEK_LIMIT - MAX_WORK_WEEK_LIMIT;

      const addToDoublePlayWorkedExtraHours = Math.max(
        Math.min(remainingExtraHours, maxDoublePlayWorkedExtraHours),
        0
      );
      const addToTriplePlayWorkedExtraHours = Math.max(
        remainingExtraHours - addToDoublePlayWorkedExtraHours,
        0
      );

      singlePlayWorkedExtraHours += addToSinglePlayWorkedExtraHours;
      doublePlayWorkedExtraHours += addToDoublePlayWorkedExtraHours;
      triplePlayWorkedExtraHours += addToTriplePlayWorkedExtraHours;

      if (hasRestDay) {
        return;
      }

      // days withoud assigned hours
      const daysWithoutAssignedHours = weekReports.filter(
        (report) => report.assignedHours === 0
      );

      if (daysWithoutAssignedHours.length > 0) {
        const minWorkedHoursReport = daysWithoutAssignedHours.reduce(
          (min, report) => {
            return Math.min(min, report.workedHours);
          },
          Infinity
        );

        restWorkedHours += minWorkedHoursReport;
        return;
      }

      const minWorkedHoursReport = weekReports.reduce((min, report) => {
        return Math.min(min, report.workedHours);
      }, Infinity);

      restWorkedHours += minWorkedHoursReport;
    });

    return {
      restWorkedHours,
      singlePlayWorkedExtraHours,
      doublePlayWorkedExtraHours,
      triplePlayWorkedExtraHours,
      notWorkedHours,
    };
  }
}

interface GenerateCollaboratorAttendanceDataArgs {
  collaborators: CollaboratorEntity[];
  processedDayShifts: CollaboratorShiftDayJs[];
  processedAttendanceRecords: AttendanceRecordEntityDayJs[];
  processedTimeoffRequests: TimeOffRequestDayJs[];
  processedPublicHolidays: Dayjs[];
  employments: EmploymentEntity[];
  jobs: JobEntity[];
  branches: BranchEntity[];
}
