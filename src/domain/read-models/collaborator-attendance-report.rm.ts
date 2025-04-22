import dayjs, { Dayjs } from "dayjs";
import { TimeOffType, WorkingDayType } from "../enums";
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
  WeekShiftEntity,
} from "../entities";
import { CollaboratorShiftDayJs } from "../value-objects/day-shift.vo";

export interface CollaboratorAttendanceReport {
  collaboratorId: string;
  startDate: Date; // half month start date
  endDate: Date; // half month end date
  collaboratorDayReports: CollaboratorDayReport[];
  periodHours: PeriodHours;
  concludedWeeksHours: ConcludedWeekHours;
  tardiness: number;
  punctualityBonus: boolean;
}

export interface CollaboratorDayReport {
  date: Dayjs;
  shiftStart?: Dayjs;
  shiftEnd?: Dayjs;
  attendanceStart?: Dayjs;
  attendanceEnd?: Dayjs;
  timeOffRequestType?: TimeOffType;
  workingDayType: WorkingDayType;
  assignedHours: number;
  workedHours: number;
  extraHours: number;
  delayMinutes: number;
  anticipatedMinutes: number;
  branch?: string;
  shiftId?: string;
  attendanceRecordId?: string;
  timeoffRequestId?: string;
}

export interface PeriodHours {
  workedHours: number;
  estimatedWorkedHours: number;
  simulatedAsistanceHours: number;
  toBeCompensatedHours: number;
  vacationHours: number;
  personalLeaveHours: number;
  justifiedAbsenceByCompanyHours: number;
  nonComputableHours: number;
  compensationHours: number;
  sickLeaveHours: number;
  authorizedUnjustifiedAbsenceHours: number;
  unjustifiedAbsenceHours: number;
  publicHolidaysHours: number;
  workedSundayHours: number;
  expressHours: number;
  mealDays: number;
}

export interface ConcludedWeekHours {
  restWorkedHours: number;
  singlePlayWorkedExtraHours: number;
  doublePlayWorkedExtraHours: number;
  triplePlayWorkedExtraHours: number;
  notWorkedHours: number;
}

export interface AttendanceRawData {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
  weekShifts: WeekShiftEntity[];
  timeOffRequests: TimeOffRequestEntity[];
  attendanceRecords: AttendanceRecordEntity[];
  jobs: JobEntity[];
  collaborators: CollaboratorEntity[];
  publicHolidays: PublicHolidaysEntity[];
  employments: EmploymentEntity[];
  branches: BranchEntity[];
}

export interface ProcessedAttendanceRawData {
  processedDayShifts: CollaboratorShiftDayJs[];
  processedAttendanceRecords: AttendanceRecordEntityDayJs[];
  processedTimeoffRequests: TimeOffRequestDayJs[];
  processedPublicHolidays: Dayjs[];
}

export interface CollaboratorAttendanceData {
  collaborator: CollaboratorEntity;
  employment?: EmploymentEntity;
  job?: JobEntity;
  dayShifts: CollaboratorShiftDayJs[];
  attendanceRecords: AttendanceRecordEntityDayJs[];
  timeOffRequests: TimeOffRequestDayJs[];
  publicHolidays: Dayjs[];
  branches: BranchEntity[];
}

export interface DayReportData {
  date: dayjs.Dayjs;
  shiftStart: dayjs.Dayjs | undefined;
  shiftEnd: dayjs.Dayjs | undefined;
  attendanceStart: dayjs.Dayjs | undefined;
  attendanceEnd: dayjs.Dayjs | undefined;
  timeOffRequestType: TimeOffType | undefined;
  isRemote: boolean;
  branch?: string;
  shiftId?: string;
  attendanceRecordId?: string;
  timeoffRequestId?: string;
}

export interface CollaboratorAttendanceReportWrapper {
  collaborator: CollaboratorEntity;
  dayReportsData: DayReportData[];
  employment?: EmploymentEntity;
  job?: JobEntity;
}
