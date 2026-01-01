import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Mexico City timezone identifier
 */
export const MEXICO_TIMEZONE = "America/Mexico_City";

/**
 * Gets the year of a date in Mexico timezone (America/Mexico_City)
 * This is important for payroll calculations that span across year boundaries in UTC
 * but may still be within the same year in Mexico timezone.
 *
 * @param date - Date string or Date object in UTC
 * @returns Year number in Mexico timezone
 *
 * @example
 * // UTC: 2026-01-01T05:59:59.999Z
 * // Mexico: 2025-12-31T23:59:59.999 (GMT-6)
 * getYearInMexicoTimezone("2026-01-01T05:59:59.999Z") // Returns 2025
 */
export function getYearInMexicoTimezone(date: string | Date): number {
  return dayjs(date).tz(MEXICO_TIMEZONE).year();
}

/**
 * Converts a UTC date to Mexico timezone
 * @param date - Date string or Date object in UTC
 * @returns dayjs object in Mexico timezone
 */
export function toMexicoTimezone(date: string | Date) {
  return dayjs(date).tz(MEXICO_TIMEZONE);
}
