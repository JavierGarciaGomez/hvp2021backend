import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

export const getEarliestDate = (dates: Date[]) => {
  const earliestDate = new Date(
    Math.min(...dates.map((date) => date.getTime()))
  );
  return earliestDate;
};

export const formatDateWithoutTime = (date: Date): string =>
  `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;

export const isValidDate = (dateString: string): boolean => {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
};

export const isValidDateString = (dateString: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!regex.test(dateString)) {
    return false;
  }
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return false;
  }
  // Ensure the date string matches the ISO format to avoid invalid months or days
  return date.toISOString().slice(0, 10) === dateString;
};

export const getCurrentMexicanDate = () => {
  const options = {
    year: "numeric" as const,
    month: "2-digit" as const,
    day: "2-digit" as const,
  };
  const date = new Date().toLocaleDateString("es-MX", options);
  const [day, month, year] = date.split("/");
  return `${year}-${month}-${day}`;
};

export const validateDateDay = (date: string | Date, day: string): boolean => {
  const parsedDate = dayjs(date);
  const dayOfWeek = parsedDate.format("dddd").toLowerCase();
  return dayOfWeek === day.toLowerCase();
};

export const checkIsMonday = (date: string | Date): boolean =>
  validateDateDay(date, "Monday");

export const checkIsSunday = (date: string | Date): boolean =>
  validateDateDay(date, "Sunday");

export const sortDates = (dates: Date[]): Date[] => {
  return dates.sort((a, b) => new Date(a).getTime() - new Date(b).getTime());
};

export const getLatestDate = (dates: Date[]): Date => {
  const date = sortDates(dates)[dates.length - 1];
  return new Date(date);
};

export const getFirstMondayOfExtendedHalfWeek = (date: dayjs.Dayjs) => {
  // Asegurar que trabajamos en timezone de México
  const mxDate = dayjs(date).tz("America/Mexico_City");
  const dayOfMonth = mxDate.date();
  const targetDay = dayOfMonth <= 15 ? 1 : 16;
  const targetDate = mxDate.date(targetDay);

  const dayOfWeek = targetDate.day();

  if (dayOfWeek === 1) {
    return targetDate;
  }

  const daysToMonday = (dayOfWeek + 6) % 7;
  const monday = targetDate.subtract(daysToMonday, "day");

  return monday;
};

export const getLastSundayOfExtendedHalfWeek = (date: dayjs.Dayjs) => {
  // Asegurar que trabajamos en timezone de México
  const mxDate = dayjs(date).tz("America/Mexico_City");
  const dayOfMonth = mxDate.date();

  const targetDay = dayOfMonth <= 15 ? 15 : mxDate.daysInMonth();
  const targetDate = mxDate.date(targetDay);

  const dayOfWeek = targetDate.day();
  if (dayOfWeek === 0) {
    return targetDate;
  }

  const daysToSunday = (7 - dayOfWeek) % 7; // Days to add to reach Sunday
  const sunday = targetDate.add(daysToSunday, "day");

  return sunday;
};

export const transformMxDateTimeToUtcStartOfDay = (date: dayjs.Dayjs) => {
  const utcDate = dayjs(date).utc();
  const startOfDay = utcDate.startOf("day");

  return startOfDay;
};

export const transformMxDateTimeToEsStartOfDay = (date: dayjs.Dayjs) => {
  const madridDate = dayjs(date).tz("Europe/Madrid");

  const startOfDate = madridDate.startOf("day");

  return startOfDate;
};

export const convertUtcDateToMexicoTimeStartOfDay = (
  utcDate: Date | string | Dayjs
) => {
  const dateString = dayjs.utc(utcDate).format("YYYY-MM-DD");
  return dayjs.tz(`${dateString}T00:00:00`, "America/Mexico_City");
};

export const getMxDayjsDatetimeByDateAndTime = (date: string, time: string) => {
  const result = dayjs.tz(`${date}T${time}`, "America/Mexico_City");
  return result;
};

export const toMexicoStartOfDay = (date: string | Date) => {
  const inputDateTime = dayjs(date);
  // spanish
  const spanishDate = dayjs(date).tz("Europe/Madrid").format("YYYY-MM-DD");
  // utc
  const utcDate = dayjs(date).tz("UTC").format("YYYY-MM-DD");

  const mexicoStartOfDay = getStartOfDayInTimezone(date, "America/Mexico_City");
  const spanishStartOfDay = getStartOfDayInTimezone(date, "Europe/Madrid");
  const utcStartOfDay = getStartOfDayInTimezone(date, "UTC");

  if (inputDateTime.isSame(mexicoStartOfDay)) {
    return mexicoStartOfDay;
  }

  if (inputDateTime.isSame(spanishStartOfDay)) {
    return dayjs.tz(spanishDate, "America/Mexico_City").startOf("day");
  }

  if (inputDateTime.isSame(utcStartOfDay)) {
    return dayjs.tz(utcDate, "America/Mexico_City").startOf("day");
  }

  return utcStartOfDay;
};

const getStartOfDayInTimezone = (date: string | Date, timezone: string) => {
  const result = dayjs(date).tz(timezone).startOf("day");

  return result;
};

export const getDayjsRangeFromDates = (
  startDate: Dayjs,
  endDate: Dayjs
): Dayjs[] => {
  const days = [];
  for (
    let date = startDate;
    date.isSameOrBefore(endDate);
    date = date.add(1, "day")
  ) {
    days.push(date);
  }
  return days;
};

export const calculateProportionalHours = (
  datetime1: string | Date | dayjs.Dayjs,
  datetime2: string | Date | dayjs.Dayjs
) => {
  return dayjs(datetime2).diff(dayjs(datetime1), "minutes") / 60;
};

export const minutesBetweenDatetimes = (
  datetime1: string | Date | dayjs.Dayjs,
  datetime2: string | Date | dayjs.Dayjs
) => {
  return dayjs(datetime2).diff(dayjs(datetime1), "minutes");
};

export const isDatetimeAfter = (
  datetime1: string | Date | dayjs.Dayjs,
  datetime2: string | Date | dayjs.Dayjs
) => {
  return dayjs(datetime1).isAfter(dayjs(datetime2));
};

export const isDatetimeBefore = (
  datetime1: string | Date | dayjs.Dayjs,
  datetime2: string | Date | dayjs.Dayjs
) => {
  return dayjs(datetime1).isBefore(dayjs(datetime2));
};

export const getPreviousSunday = (date: Dayjs) => {
  const mxDate = dayjs(date).tz("America/Mexico_City");
  console.log("getPreviousSunday - input date:", mxDate.format("YYYY-MM-DD"));
  console.log("getPreviousSunday - day of week:", mxDate.day());
  // Si el día es domingo (0), retorna la misma fecha
  const result =
    mxDate.day() === 0 ? mxDate : mxDate.subtract(mxDate.day(), "day");
  console.log("getPreviousSunday - result:", result.format("YYYY-MM-DD"));
  console.log("FINISHED");
  return result;
};

export const getMxPeriodKey = (date: Date | Dayjs, periodType: string) => {
  const dayjsDate = dayjs(date).tz("America/Mexico_City");
  switch (periodType) {
    case "month":
      return dayjsDate.format("YYYY-MMM");
    case "half-month":
      return `${dayjsDate.format("YYYY-MMM")}-${
        dayjsDate.date() <= 15 ? "H1" : "H2"
      }`;
    case "quarter":
      return `${dayjsDate.format("YYYY")}-Q${Math.ceil(
        (dayjsDate.month() + 1) / 3
      )}`;
    case "year":
      return dayjsDate.format("YYYY");
    default:
      throw new Error(`Unsupported period type: ${periodType}`);
  }
};

const MX_TIMEZONE = "America/Mexico_City";

/**
 * Get the start of a year in Mexico timezone
 * @param year - The year number (e.g., 2025)
 * @returns Dayjs object representing Jan 1st 00:00:00 in Mexico timezone
 */
export const getMxStartOfYear = (year: number): Dayjs => {
  return dayjs.tz(`${year}-01-01`, MX_TIMEZONE).startOf("day");
};

/**
 * Get the end of a year in Mexico timezone
 * @param year - The year number (e.g., 2025)
 * @returns Dayjs object representing Dec 31st 23:59:59 in Mexico timezone
 */
export const getMxEndOfYear = (year: number): Dayjs => {
  return dayjs.tz(`${year}-12-31`, MX_TIMEZONE).endOf("day");
};

/**
 * Convert a date to Mexico timezone and get start of day
 * @param date - Date to convert
 * @returns Dayjs object representing the date at 00:00:00 in Mexico timezone
 */
export const toMxStartOfDay = (date: Date | string | Dayjs): Dayjs => {
  return dayjs(date).tz(MX_TIMEZONE).startOf("day");
};

/**
 * Compare if date A is after date B, both normalized to Mexico timezone start of day
 * @param dateA - First date
 * @param dateB - Second date
 * @returns true if dateA is after dateB
 */
export const isMxDateAfter = (
  dateA: Date | string | Dayjs,
  dateB: Date | string | Dayjs
): boolean => {
  const mxDateA = toMxStartOfDay(dateA);
  const mxDateB = toMxStartOfDay(dateB);
  return mxDateA.isAfter(mxDateB);
};

/**
 * Calculate the number of days between two dates (inclusive)
 * Both dates are normalized to Mexico timezone start of day
 * @param startDate - Start date
 * @param endDate - End date
 * @returns Number of days between the dates (inclusive)
 */
export const calculateMxDaysBetween = (
  startDate: Date | string | Dayjs,
  endDate: Date | string | Dayjs
): number => {
  const start = dayjs(startDate).tz(MX_TIMEZONE).startOf("day");
  const end = dayjs(endDate).tz(MX_TIMEZONE).startOf("day");
  return end.diff(start, "day") + 1;
};
