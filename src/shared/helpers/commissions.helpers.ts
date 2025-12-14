import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import { PeriodData } from "../interfaces";

dayjs.extend(utc);
dayjs.extend(timezone);

export const getCommissionsStatsPeriodsByPeriodAndDates = (
  period: "half-month" | "month" | "quarter" | "year",
  startDate: Date,
  endDate: Date
): PeriodData => {
  let periods: number;
  let extendedStartDate: dayjs.Dayjs;

  const start = dayjs.tz(startDate, "America/Mexico_City");
  console.log({ start: start.toISOString() });

  switch (period) {
    case "half-month":
      periods = 13;
      extendedStartDate = start.subtract(6, "months");
      break;
    case "month":
      periods = 13;
      extendedStartDate = start.subtract(12, "months");
      break;
    case "quarter":
      periods = 9;
      extendedStartDate = start.subtract(2, "years");
      break;
    case "year":
      periods = 4;
      extendedStartDate = start.subtract(3, "years");
      break;
    default:
      throw new Error("Invalid period");
  }

  return {
    period,
    periods,
    periodStartDate: start.toDate(),
    periodEndDate: dayjs.tz(endDate, "America/Mexico_City").toDate(),
    extendedStartDate: extendedStartDate.toDate(),
    extendedEndDate: dayjs.tz(endDate, "America/Mexico_City").toDate(),
  };
};
