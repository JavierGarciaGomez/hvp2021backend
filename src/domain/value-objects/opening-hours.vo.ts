import { DayOfWeek } from "../enums/date.enums";

export interface OpeningHoursVO {
  day: DayOfWeek;
  open?: string;
  close?: string;
}
