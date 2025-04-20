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
  const dayOfMonth = date.date();
  const targetDay = dayOfMonth <= 15 ? 1 : 16;
  const targetDate = date.date(targetDay);

  const dayOfWeek = targetDate.day();

  if (dayOfWeek === 1) {
    return targetDate;
  }

  const daysToMonday = (dayOfWeek + 6) % 7;
  const monday = targetDate.subtract(daysToMonday, "day");

  return monday;
};

export const getLastSundayOfExtendedHalfWeek = (date: dayjs.Dayjs) => {
  const dayOfMonth = date.date();

  const targetDay = dayOfMonth <= 15 ? 15 : date.daysInMonth();
  const targetDate = date.date(targetDay);

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
  return utcDate.startOf("day");
};

export const transformMxDateTimeToEsStartOfDay = (date: dayjs.Dayjs) => {
  const madridDate = dayjs(date).tz("Europe/Madrid");
  return madridDate.startOf("day");
};

export const convertUtcDateToMexicoTimeStartOfDay = (
  utcDate: Date | string | Dayjs
) => {
  const dateString = dayjs.utc(utcDate).format("YYYY-MM-DD");
  return dayjs.tz(`${dateString}T00:00:00`, "America/Mexico_City");
};

export const getMxDayjsDatetimeByDateAndTime = (date: string, time: string) => {
  const result = dayjs.tz(`${date}T${time}`, "America/Mexico_City");

  const year = result.year();

  // If the year is 2022 or later, Mexico no longer observes DST, so we enforce UTC-6
  if (year >= 2022) {
    if (result.utcOffset() !== -360) {
      return result.utcOffset(-6 * 60, true); // UTC-6 without DST
    }
  }

  // For dates before 2022, return the result as is
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
  const localDate = dayjs(date).tz(timezone).format("YYYY-MM-DD");
  return dayjs(`${localDate}T00:00:00`).tz(timezone).startOf("day");
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
  // Si el día es domingo (0), retorna la misma fecha
  return date.day() === 0 ? date : date.subtract(date.day(), "day");
};
