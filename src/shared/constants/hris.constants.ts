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

export const LEGAL_VACATIONS = {
  old: [
    0, // 0 años
    6, // 1
    8, // 2
    10, // 3
    12, // 4
    14, // 5
    14, // 6
    14, // 7
    14, // 8
    14, // 9
    16, // 10
    16, // 11
    16, // 12
    16, // 13
    16, // 14
    18, // 15
    18, // 16
    18, // 17
    18, // 18
    18, // 19
    20, // 20
    20, // 21
    20, // 22
    20, // 23
    20, // 24
    22, // 25
    22, // 26
    22, // 27
    22, // 28
    22, // 29
    24, // 30
  ],
  new: [
    0, // 0 años
    12, // 1
    14, // 2
    16, // 3
    18, // 4
    20, // 5
    22, // 6
    22, // 7
    22, // 8
    22, // 9
    22, // 10
    24, // 11
    24, // 12
    24, // 13
    24, // 14
    26, // 15
    26, // 16
    26, // 17
    26, // 18
    26, // 19
    28, // 20
    28, // 21
    28, // 22
    28, // 23
    28, // 24
    30, // 25
    30,
    30,
    30,
    30,
    30,
  ],
};
