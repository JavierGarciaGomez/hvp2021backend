import { Degree } from "../../domain";

export const VACATION_BONUS_PERCENTAGE = 0.25; // *
export const SUNDAY_BONUS_PERCENTAGE = 0.25; // *
export const MAX_WORK_WEEK_LIMIT = 48;
export const MAX_DOUBLE_PLAY_WORK_WEEK_LIMIT = 57; // *
export const HOLIDAY_OR_REST_EXTRA_PAY_PERCENTAGE = 2;
export const ANNUAL_RAISE_PERCENT = 0.02;
export const WORKING_DAYS_IN_A_WEEK = 6;
export const AVERAGE_WORK_DAYS_PER_MONTH =
  (365 / 12 / 7) * WORKING_DAYS_IN_A_WEEK;
export const COMMISSION_SENIORITY_BONUS_PER_SEMESTER = 0.05;
export const WEEKS_IN_MONTH = 4.34524;
export const MONTH_DAYS = 30;
export const MONTH_WORK_DAYS = 6 * WEEKS_IN_MONTH;
export const WEEK_WORK_DAYS = 6;
export const DAILY_WORK_HOURS = 8;
export const YEAR_END_BONUS_DAYS = 15;

export const JUSTIFIED_ABSENCES_PERCENTAGE = 0.6; // CANCELLED
export const DAILY_MEAL_COMPENSATION = 50; // CANCELLED

export const DEGREE_BONUS = {
  // CANCELLED
  [Degree.HighSchool]: 0,
  [Degree.UniversityStudent]: 0,
  [Degree.BachelorComplete]: 0,
  [Degree.Graduated]: 300,
  [Degree.Masters]: 600,
  [Degree.Doctorate]: 900,
  [Degree.Other]: 0,
};
