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
  const startOfDay = utcDate.startOf("day");

  return startOfDay;
};

export const transformMxDateTimeToEsStartOfDay = (date: dayjs.Dayjs) => {
  const madridDate = dayjs(date).tz("Europe/Madrid");

  const startOfDate = madridDate.startOf("day");
  console.log({
    date: date.toISOString(),
    madridDate: madridDate.toISOString(),
    startOfDate: startOfDate.toISOString(),
  });

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

  console.log({
    inputDateTime: inputDateTime.toISOString(),
    mexicoStartOfDay: mexicoStartOfDay.toISOString(),
    spanishStartOfDay: spanishStartOfDay.toISOString(),
    utcStartOfDay: utcStartOfDay.toISOString(),
  });

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
  console.log({
    input: date,
    timezone,
    result: result.toISOString(),
  });
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
  // Si el día es domingo (0), retorna la misma fecha
  return date.day() === 0 ? date : date.subtract(date.day(), "day");
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
