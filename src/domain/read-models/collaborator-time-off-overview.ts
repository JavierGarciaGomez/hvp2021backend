import { Schema } from "mongoose";
import { TimeOffStatus, TimeOffType } from "../enums";

export interface CollaboratorTimeOffOverview {
  collaboratorId: string;
  totalVacationDays: number; // a) The number of vacation days the collaborator has a right to take
  vacationsTaken: Date[]; // b) Vacations taken by the collaborator (an array of dates)
  vacationsRequested: Date[]; // c) Vacations requested but not approved (an array of dates)
  remainingVacationDays: number; // d) Number of vacation days left for the collaborator
  dateTimeOffRequests: DateTimeOffRequest[];
  lastAnniversaryDate: Date; // e) The last anniversary date of the collaborator
  legalVacationDays: number; // f) The number of legal vacation days the collaborator has a right to take
  remainingLegalVacationDays: number;
  remainingcurrentYearVacationDays: number;
}

export interface DateTimeOffRequest {
  date: Date;
  id: string;
  timeOffType: TimeOffType;
  status: TimeOffStatus;
  collaborator: string;
}
