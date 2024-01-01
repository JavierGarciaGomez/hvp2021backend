import mongoose from "mongoose";

import {
  AttendanceType,
  TimeOffStatus,
  TimeOffType,
} from "../constants/AttendanceConstants";
import { TimeOffRequest } from "../types/timeOffTypes";
import duration from "dayjs/plugin/duration";
import dayjs from "../config/dayjsConfig";

/*
Vacations 

Artículo 76.- Las personas trabajadoras que tengan más de un año de servicios disfrutarán de un
periodo anual de vacaciones pagadas, que en ningún caso podrá ser inferior a doce días laborables, y
que aumentará en dos días laborables, hasta llegar a veinte, por cada año subsecuente de servicios.
A partir del sexto año, el periodo de vacaciones aumentará en dos días por cada cinco de servicios

1st year 12
2nd year 14
3rd year 16
4th year 18
5th year 20
6th year 22
7th year 22
8th year 22
9th year 22
10th year 22
11th year 24
12th year 24
13th year 24
14th year 24
15th year 24
16th year 26
*/
export const calculateVacations = (
  startDate: Date,
  timeOffRequests: TimeOffRequest[],
  remainingVacationsAtDecember2020 = 0
) => {
  //get vacations taken
  const vacationsApproved = timeOffRequests.filter(
    (timeOffRequest) =>
      timeOffRequest.timeOffType === TimeOffType.vacation &&
      timeOffRequest.status === TimeOffStatus.approved
  );

  // const vacs = calculateVacationsRightForAGivenPeriod(startDate);

  const vacationsDays: Date[] = [];
  vacationsApproved.forEach((vacations) => {
    vacations.requestedDays.forEach((day) => {
      vacationsDays.push(day);
    });
  });

  // Vacations time
};

export const calculateTotalVacationDays = (
  employmentStartDate: Date,
  endDate = new Date()
): number => {
  const vacationsBefore2023 =
    calculateVacationDaysBefore2023(employmentStartDate);
  const vacationsAfter2022 = calculateVacationsAfter2022(
    employmentStartDate,
    endDate
  );

  console.log({ vacationsBefore2023, vacationsAfter2022 });
  return vacationsBefore2023 + vacationsAfter2022;
};

export const calculateVacationDaysBefore2023 = (
  employmentStartDate: Date
): number => {
  const isStartDateBefore2023 = dayjs(employmentStartDate).isAfter(
    dayjs("2022-12-31")
  );

  if (isStartDateBefore2023) {
    return 0;
  }

  const workedYears = Math.floor(
    calculateYears(employmentStartDate, new Date("2022-12-31"))
  );
  return calculateVacationsForFullYearsBefore2023(workedYears);
};

export const calculateVacationsForFullYearsBefore2023 = (
  yearsOfWorking: number
): number => {
  if (yearsOfWorking <= 0) {
    return 0;
  }

  let totalDays = 0;

  for (let i = 1; i <= yearsOfWorking; i++) {
    totalDays += calculateVacationDaysForYearBefore2023(i);
  }

  return totalDays;
};

export const calculateVacationDaysForYearBefore2023 = (
  yearsOfWorking: number
): number => {
  if (yearsOfWorking >= 1 && yearsOfWorking < 6) {
    // 1 to 5 years
    return 6 + (yearsOfWorking - 1) * 2;
  } else if (yearsOfWorking >= 6 && yearsOfWorking <= 10) {
    // 6 to 10 years
    return 16;
  } else if (yearsOfWorking >= 11 && yearsOfWorking <= 15) {
    // 11 to 15 years
    return 18;
  } else if (yearsOfWorking >= 16 && yearsOfWorking <= 20) {
    // 16 to 20 years
    return 20;
  } else if (yearsOfWorking >= 21 && yearsOfWorking <= 25) {
    // 21 to 25 years
    return 22;
  } else if (yearsOfWorking >= 26 && yearsOfWorking <= 30) {
    // 26 to 30 years
    return 24;
  } else {
    // Default case for other values
    return 0; // You may want to handle this case differently based on your requirements
  }
};

export const calculateVacationsAfter2022 = (
  startDate: Date,
  endDate = new Date()
) => {
  const itEndedBefore2023 = dayjs(endDate).isSameOrBefore(
    dayjs("2022-12-31"),
    "day"
  );
  if (itEndedBefore2023) {
    return 0;
  }

  const startDateForCalculationAfter2022 = dayjs(startDate).isSameOrBefore(
    dayjs("2023-01-01")
  )
    ? dayjs(startDate).set("year", 2022).toDate()
    : dayjs(startDate).startOf("day").toDate();

  const fullyWorkedYearsBefore2023 = Math.floor(
    calculateYears(startDate, new Date("2022-12-31"), false)
  );

  const fullyWorkedYearsAfter2022 = calculateYears(
    startDateForCalculationAfter2022,
    endDate
  );

  const vacationsForFullYearsAfter2022 =
    calculateVacationsForFullYearsAfter2022(
      fullyWorkedYearsBefore2023,
      fullyWorkedYearsAfter2022
    );

  const remainingOfTheLastYear = fullyWorkedYearsAfter2022 % 1;

  const totalWorkedYears =
    Math.floor(fullyWorkedYearsBefore2023) +
    Math.floor(fullyWorkedYearsAfter2022);

  const vacationsForPartialYearAfter2022 = Math.floor(
    calculateVacationsForYearAfter2022(totalWorkedYears + 1) *
      remainingOfTheLastYear
  );

  console.log({
    vacationsForFullYearsAfter2022,
    vacationsForPartialYearAfter2022,
  });

  return vacationsForFullYearsAfter2022 + vacationsForPartialYearAfter2022;
};

export const calculateVacationsForFullYearsAfter2022 = (
  yearsWorkedBefore2023: number,
  yearsAfter2022: number
) => {
  let totalDays = 0;
  const startingYear = Math.floor(yearsWorkedBefore2023) + 1;
  const lastYear = Math.floor(yearsWorkedBefore2023 + yearsAfter2022);

  for (let i = startingYear; i <= lastYear; i++) {
    const daysForYear = calculateVacationsForYearAfter2022(i);

    totalDays += daysForYear;
  }

  return totalDays;
};

export const calculateVacationsForYearAfter2022 = (
  yearsOfWorking: number
): number => {
  if (yearsOfWorking >= 1 && yearsOfWorking < 6) {
    // 1 to 5 years
    return 12 + (yearsOfWorking - 1) * 2;
  } else if (yearsOfWorking >= 6 && yearsOfWorking <= 10) {
    // 6 to 10 years
    return 22;
  } else if (yearsOfWorking >= 11 && yearsOfWorking <= 15) {
    // 11 to 15 years
    return 24;
  } else if (yearsOfWorking >= 16 && yearsOfWorking <= 20) {
    // 16 to 20 years
    return 26;
  } else if (yearsOfWorking >= 21 && yearsOfWorking <= 25) {
    // 21 to 25 years
    return 28;
  } else if (yearsOfWorking >= 26 && yearsOfWorking <= 30) {
    // 26 to 30 years
    return 30;
  } else {
    // Default case for other values
    return 0; // You may want to handle this case differently based on your requirements
  }
};

export const calculateYears = (
  startDate: Date,
  endDate = new Date(),
  includeEndDate = true
): number => {
  const newEndDate = includeEndDate
    ? dayjs(endDate).add(1, "day")
    : dayjs(endDate);
  if (startDate > endDate) return 0;

  const years = newEndDate.diff(dayjs(startDate), "year", true);
  return years;
};
